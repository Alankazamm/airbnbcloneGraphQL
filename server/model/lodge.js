const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const lodgeSchema = MSchema({

	title: String,
	typeOfInn: String,
	rooms: { beds: Number, rooms: Number, bathRooms: Number },
	maxGuests: Number,
	city: String,
	country: String,
	rating: Number,
	avaliability: Boolean,
	hostId: String,
});

module.exports = mongoose.model("Lodge", lodgeSchema);