const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const dbURI = process.env.MONGODB_URI

console.log("Database URI:", dbURI);
console.log("Connection to Database");

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(res => {
    console.log("Connected to the database.");
}).catch(err => {
    console.log("error connecting to the mongodb:", err.message);
})

const personSchema = new mongoose.Schema({
	name: {
        type: String,
	minLength: 3,
	required: true,
	unique: true,
	uniqueCaseInsensitive: true
    },
    number: {
        type: String,
	minLength: 8,
	required: true
    }
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString(),
        delete returnedObj.__v,
        delete returnedObj._id
    }
})

module.exports = mongoose.model("Person", personSchema);
