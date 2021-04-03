const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express()
const PORT = process.env.PORT || 3001;
let persons = [
    {
        id: 1,
        name: "Om",
        number: "596-496-59950"
    },
    {
        id: 2,
        name: "Shri Ram Chandra Jee",
        number: "596-496-59950"
    },
    {
        id: 3,
        name: "Ravana The Lankesh",
        number: "596-496-59950"
    },
    {
        id: 4,
        name: "Bajrang Bali",
        number: "596-496-59950"
    },
    {
        id: 5,
        name: "Har Har Mahadev",
        number: "596-496-59950"
    }
]

app.use(express.static('build'))
app.use(cors())
app.use(express.json());

morgan.token("json-data", (req, res) => req.method === "POST" ? JSON.stringify(req.body) : "")
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :json-data'));

app.get("/", (req, res) => {
    res.send("<h1>Hello World!!</h1><p>This is Phonebook Service API.</p>");
})

app.get("/info", (req, res) => {
    const totalPersons = persons.length;
    const currentTime = new Date();
    res.send(`<p>Phonebook has info of ${totalPersons} persons.</p><p><i>${currentTime}</i></p>`);
})

app.get("/api/persons", (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.post("/api/persons", (req, res) => {
    const data = req.body;
    if (!data.name || !data.number) {
        return res.status(400).json({error: "must contain name and number fields"});
    } else if (persons.filter(p => p.name === data.name).length !== 0) {
        return res.status(406).json({error: "name already added, must be unique"});
    } else {
        let person = {
            id: Math.floor(Math.random() * 50000),
            name: data.name,
            number: data.number
        }
        persons.push(person);
        res.json(person);
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
})

app.listen(PORT, "localhost", () => {
    console.log(`Server running on port ${PORT}`)
})
