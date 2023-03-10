const graphql = require("graphql");
const User = require("../model/user");
const Lodge = require("../model/lodge");
const Host = require("../model/host");
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

//Dummy data
//user's data
let users = [
	{
		id: "1",
		name: "John",
		email: "j@email.com",
		password: "123",
		city: "London",
	},
	{
		id: "2",
		name: "Jane",
		email: "jane@email.com",
		password: "123",
		city: "Sourbone",
	},
	{
		id: "3",
		name: "Jack",
		email: "jack@email.com",
		password: "123",
		city: "Titanic",
	},
];
//lodge's data
let lodges = [
	{
		id: "1",
		title: "Apartment in center",
		typeOfInn: "Apartment",
		rooms: { beds: 2, rooms: 1, bathRooms: 1 },
		maxGuests: 4,
		city: "London",
		country: "UK",
		rating: 4,
		avaliability: true,
		hostId: "1",
	},
	{
		id: "2",
		title: "Castle",
		typeOfInn: "Private Room",
		rooms: { beds: 1, rooms: 100, bathRooms: 10 },
		maxGuests: 2,
		city: "Versales",
		country: "FR",
		rating: 5,
		avaliability: false,
		hostId: "2",
	},
	{
		id: "3",
		title: "Titanic trip",
		typeOfInn: "Cruzer Room",
		rooms: { beds: 3, rooms: 1, bathRooms: 30 },
		maxGuests: 2,
		city: "Titanic",
		country: "Ocean",
		rating: 1,
		avaliability: true,
		hostId: "3",
	},
];
//host's data
let hosts = [
	{ id: "1", name: "John", rating: 4, superHost: false },
	{ id: "2", name: "Jane", rating: 5, superHost: true },
	{ id: "3", name: "Jack", rating: 1, superHost: false },
];
//Create types

//UserType
const UserType = new GraphQLObjectType({
	name: "User",
	description:
		"Normal customer for the app, after register password, email and password for login, city for future geolocation distances implementation and name for identification.",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
		city: { type: GraphQLString },
	}),
});

//LodgeType
const LodgeType = new GraphQLObjectType({
	name: "Lodge",
	description:
		"It fetches the lodge location(city and country), if the host is or not SuperHost, the type of lodge(apartment, private room, etc..) maxNumber of guests, the title for advertisement, it's avaliability and their rooms.",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		typeOfInn: { type: GraphQLString },
		rooms: {
			type: new GraphQLObjectType({
				name: "Rooms",
				description: "It fetches the number of rooms, beds and bathrooms.",
				fields: () => ({
					beds: { type: GraphQLInt },
					rooms: { type: GraphQLInt },
					bathRooms: { type: GraphQLInt },
				}),
			}),
		},
		maxGuests: { type: GraphQLInt },
		city: { type: GraphQLString },
		country: { type: GraphQLString },
		rating: { type: GraphQLFloat },
		avaliability: { type: GraphQLBoolean },
		hostId: { type: GraphQLID },
		host: {
			type: HostType,

			resolve(parent, args) {
				return Host.findById(parent.hostId);
			},
		},
	}),
});

//Host's Type
const HostType = new GraphQLObjectType({
	name: "Host",
	description:
		"Host information, that contains the identifier for relationship with the lodges, and if it is a superhost",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		rating: { type: GraphQLFloat },
		superHost: { type: GraphQLBoolean },
		lodges: {
			type: new GraphQLList(LodgeType),
			resolve(parent, args) {
				return Lodge.find({ hostId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	description: "Query user's data from the UserType interface.",
	fields: {
		user: {
			type: UserType,
			args: {
				id: { type: GraphQLID },
			},

			resolve(parent, args) {
				return User.findById(args.id);
			},
		},

		lodge: {
			type: LodgeType,
			args: {
				id: { type: GraphQLID },
				// title: { type: GraphQLString },
				// avaliability: { type: GraphQLBoolean },
				// superHost: { type: GraphQLBoolean },
			},

			resolve(parent, args) {
				return Lodge.findById(args.id);
			},
		},
		host: {
			type: HostType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				return Host.findById(args.id);
			},
		},
		//list of lodges by criteria
		allLodges: {
			type: new GraphQLList(LodgeType),
			args: {
				title: { type: GraphQLString },
				avaliability: { type: GraphQLBoolean },
			},

			resolve(parent, args) {
				//filter by for each criteria as args are passed

				if (args.title !== undefined && args.avaliability !== undefined) {
					return Lodge.find({
						title: args.title,
						avaliability: args.avaliability,
					});
				} else if (args.title !== undefined) {
					return Lodge.find({ title: args.title });
				} else if (args.avaliability !== undefined) {
					return Lodge.find({ avaliability: args.avaliability });
				} else {
					return Lodge.find({});
				}
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	description: "manipulates data...",
	fields: () => ({
		CreateUser: {
			type: UserType,
			args: {
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				password: { type: GraphQLInt },
				city: { type: GraphQLString },
			},
			resolve(parent, args) {
				//create an id random and unique
				let id = Math.floor(Math.random() * 1000);
				let user = User({
					name: args.name,
					email: args.email,
					password: args.password,
					city: args.city,
				});
				return user.save();
			},
		},
		CreateLodge: {
			type: LodgeType,
			args: {
				title: { type: GraphQLString },
				typeOfInn: { type: GraphQLString },
				rooms: { type: GraphQLInt },
				beds: { type: GraphQLInt },
				bathRooms: { type: GraphQLInt },
				maxGuests: { type: GraphQLInt },
				city: { type: GraphQLString },
				country: { type: GraphQLString },
				rating: { type: GraphQLFloat },
				avaliability: { type: GraphQLBoolean },
				hostId: { type: GraphQLID },
			},
			resolve(parent, args) {
				let lodge = Lodge({
					title: args.title,
					typeOfInn: args.typeOfInn,
					rooms: {
						rooms: args.rooms,
						beds: args.beds,
						bathRooms: args.bathRooms,
					},
					maxGuests: args.maxGuests,
					city: args.city,
					country: args.country,
					rating: args.rating,
					avaliability: args.avaliability,
					hostId: args.hostId,
				});
				return lodge.save();
			},
		},

		CreateHost: {
			type: HostType,
			args: {
				name: { type: GraphQLString },
				rating: { type: GraphQLFloat },
				superHost: { type: GraphQLBoolean },
			},
			resolve(parent, args) {
				let host = Host({
					name: args.name,
					rating: args.rating,
					superHost: args.superHost,
				});
				return host.save();
			},
		},
		//updating datas
		UpdateUser: {
			type: UserType,
			args: {
				id: { type: GraphQLNonNull(GraphQLString)},
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
				city: { type: GraphQLNonNull(GraphQLString)},
			},
			resolve(parent, args) {
				return updatedUser = User.findByIdAndUpdate(
					args.id,
					{
						$set:{
							name: args.name,
							email: args.email,
							password: args.password,
							city: args.city,
						}
					},
					{new: true}
				)
			}
		},
		UpdateHost: {
			type: HostType,
			args: {
				id: { type: GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				rating: { type: GraphQLFloat },
				superHost: { type: GraphQLBoolean },
			},
			resolve(parent, args) {
				return updatedHost = Host.findByIdAndUpdate(
					args.id,
					{
						$set: {
							name: args.name,
							rating: args.rating,
							superHost: args.superHost,
						}
					},
					{new: true},
				)	
			}
		},
		UpdateLodge: {
			type: LodgeType,
			args: {
				id: { type: GraphQLNonNull(GraphQLString)},
				title: { type: GraphQLNonNull(GraphQLString) },
				typeOfInn: { type: GraphQLNonNull(GraphQLString) },
				rooms: { type: GraphQLNonNull(GraphQLInt) },
				beds: { type: GraphQLNonNull(GraphQLInt) },
				bathRooms: { type: GraphQLNonNull(GraphQLInt) },
				maxGuests: { type: GraphQLNonNull(GraphQLInt) },
				city: { type: GraphQLNonNull(GraphQLString) },
				country: { type: GraphQLNonNull(GraphQLString) },
				rating: { type: GraphQLNonNull(GraphQLFloat) },
				avaliability: { type: GraphQLNonNull(GraphQLBoolean) },
				hostId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return updatedLodge = Lodge.findByIdAndUpdate(
					args.id,
					{
						$set: {
							title: args.title,
							typeOfInn: args.typeOfInn,
							rooms: args.rooms,
							beds: args.beds,
							bathRooms: args.bathRooms,
							maxGuests: args.maxGuests,
							city: args.city,
							country: args.country,
							rating: args.rating,
							avaliability: args.avaliability,
							hostId: args.hostId,
						}
					},
					{new: true},
				)
			}
		},
		//deleting datas
		RemoveUser: {
			type: UserType,
			args: {
				id: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				let removedUser = User.findByIdAndRemove(
					args.id
				).exec();
				if (!removedUser) {
					throw new ("Error")
				}
				return removedUser;
			}
		},
		RemoveHost: {
			type: HostType,
			args: {
				id: { type: GraphQLNonNull(GraphQLString)}
			},
			resolve(parent, args) {
				let removedHost = Host.findByIdAndRemove(args.id).exec();
				if (!removedHost) {
					throw new ("Error");
				}
				return removedHost;
			}
		},
		RemoveLodge: {
			type: LodgeType,
			args: { id: { type: GraphQLNonNull(GraphQLString) } },
			resolve(parent, args) {
				let removedLodge = Lodge.findByIdAndRemove(args.id).exec();
				if (!removedHost) {
					throw new ("Error");
				}
				return removedLodge;
			}
		},
	}),
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
