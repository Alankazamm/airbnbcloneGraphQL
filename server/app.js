const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();


const schema = require('./schema/schema');
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(4000, () => {
    console.log('Server started on port 4000');
})