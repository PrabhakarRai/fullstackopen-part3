require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const Person = require('./models/person');

app.use(express.static('build'))
app.use(cors());
app.use(express.json());

morgan.token("json-data", (req, res) => req.method === "POST" ? JSON.stringify(req.body) : null)
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :json-data'));

let allPersonsCount = 0;
Person.find({}).then(result => { allPersonsCount = result.length; })

app.get("/about", (req, res) => {
    res.send("<h1>Hello World!!</h1><p>This is Phonebook Service API.</p>");
})

app.get("/info", (req, res) => {
    const currentTime = new Date();
    res.send(`<p>Phonebook has info of ${allPersonsCount} persons.</p><p><i>${currentTime}</i></p>`);
})

app.get("/api/persons", (req, res, next) => {
    Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err));
})

app.post("/api/persons", (req, res, next) => {
    const data = req.body;
    if (data.name === undefined || data.number === undefined) {
        return res.status(400).json({ error: "must contain name and number fields" });
    } else {
        let person = new Person({
            name: data.name,
            number: data.number
        })
        person.save()
            .then(savedPerson => {
                allPersonsCount++;
                res.json(savedPerson);
            })
            .catch(err => {
                next(err);
            });
    }
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end();
            }
        })
        .catch((err => {
            next(err);
        }))
})

app.put("/api/persons/:id", (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch((err => {
            next(err);
        }))
})


app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end();
    }).catch(err => next(err));
})

const unknownEndpointHandler = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
}
app.use(unknownEndpointHandler);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(err);
}
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
