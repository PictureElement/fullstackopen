// Imports & App Initialization

const express = require("express");
const morgan = require("morgan");
const app = express();

// Data / Resources

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Middlewares

// Define a `data` token that only returns the data sent in HTTP POST requests
morgan.token("data", function (request, response) {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data"),
);
// Serve the static frontend files from the local `dist` folder
app.use(express.static("dist"));

// Helper Functions

// Generates a random number between 1 (inclusive) and max (inclusive)
const generateId = (max) => {
  const randomId = Math.floor(Math.random() * max + 1);

  return String(randomId);
};

// Routes

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numEntries = persons.length;
  const currentTime = new Date();

  response.send(`
    <p>Phonebook has info for ${numEntries} people</p>
    <p><time>${currentTime}</time></p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);
  if (person) return response.json(person);

  response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(1000000),
    ...body,
  };
  persons = persons.concat(person);

  response.json(person);
});

// Server Initialization

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
