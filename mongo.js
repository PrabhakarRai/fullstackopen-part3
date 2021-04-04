const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const dbURI = `mongodb+srv://fullstackopen:${password}@cluster0.hvyas.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log("[+] Connecting to the database");
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, err => {
    if (err) {
        throw err
    } else {
        console.log("[+] Successfully connected to the database.");
    }
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);


if (process.argv.length == 5) {
    console.log("[+] Adding person to the collection");
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`[+] Added ${result.name} whose number is ${result.number} into database.`);
        mongoose.connection.close();
    }).catch(err => {
        console.log(err);
        mongoose.connection.close();
    })
} else {
    console.log("[+] Retriving all people.");
    Person.find({}).then(result => {
        console.log("Phonebook: ")
        result.forEach(p => {console.log(p.name, p.number)});
        mongoose.connection.close();
    }).catch(err => {
        console.log(err);
        mongoose.connection.close();
    })
}
