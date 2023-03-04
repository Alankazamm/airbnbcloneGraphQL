const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const schema = require("./server/schema/schema");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
app.use(
	"/graphql",
	graphqlHTTP({
		graphiql: true,
		schema: schema,
	}),
);
mongoose.connect(
    `mongodb+srv://alankazam:${process.env.mongoUserPassword}@cluster0.hjcuf3m.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => {


    app.listen({port: PORT}, () => {
        console.log(`Server started on port ${PORT}`);
    })
}).catch(err => {
    console.log(err);
})
