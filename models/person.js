const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI

console.log("Database URI:", dbURI);
console.log("Connection to Database");

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(res => {
    console.log("Connected to the database.");
}).catch(err => {
    console.log("error connecting to the mongodb:", err.message);
})

const personSchema = new mongoose.Schema({
    name:   String,
    number: String
});

personSchema.set("toJSON", {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString(),
        delete returnedObj.__v,
        delete returnedObj._id
    }
})

module.exports = mongoose.model("Person", personSchema);