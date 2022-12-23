const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema/schema");
require("dotenv").config();

const app = express();

const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open',()=>{
    console.log("connected to database");
})

app.use("/graphql",graphqlHTTP({
    schema,
    graphiql:true
}));

app.listen(3000,()=>{
    console.log("Listening at http://localhost:3000")
})