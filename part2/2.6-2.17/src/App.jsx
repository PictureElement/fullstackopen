import { useState, useEffect } from "react";
import personService from "./services/persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  // 1. State
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  // 2. Derived state
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 3. Effects
  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []); // Runs only after the first render

  // 4. Helper functions
  const resetForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const createPerson = (personObject) => {
    personService
      .create(personObject)
      .then((data) => {
        setPersons([...persons, data]);
        resetForm();
        showNotification(`Added ${data.name}.`);
      })
      .catch(() => {
        showNotification("Failed to add person.", "error");
      });
  };

  const updatePerson = (personObject) => {
    personService
      .update(personObject.id, personObject)
      .then((data) => {
        setPersons(
          persons.map((person) =>
            person.id !== personObject.id ? person : data,
          ),
        );
        resetForm();
        showNotification(`Updated ${data.name}.`);
      })
      .catch(() => {
        setPersons(persons.filter((person) => person.id !== personObject.id));
        showNotification(
          "This person no longer exists on the server and was removed from your list.",
          "error",
        );
      });
  };

  // 5.  Event handlers
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const personWithSameName = persons.find(
      (person) => person.name === newName,
    );

    if (personWithSameName) {
      if (personWithSameName.number === newNumber) {
        showNotification(
          `${newName} has already been added to the phonebook with this exact number.`,
          "neutral",
        );
        return;
      } else {
        const confirmUpdate = window.confirm(
          `${newName} has already been added to the phonebook, replace the old number with the new one?`,
        );

        if (confirmUpdate) {
          const updatedPerson = { ...personWithSameName, number: newNumber };
          updatePerson(updatedPerson);
        }
      }
    } else {
      createPerson(personObject);
    }
  };

  const handleDeletePerson = (id) => {
    const found = persons.find((person) => person.id === id);
    if (!found) return;

    if (window.confirm(`Delete ${found.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(
            "This person no longer exists on the server and was removed from your list.",
            "error",
          );
        });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 6. Render
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification
        message={notification}
        notificationType={notificationType}
      />
      <Filter searchTerm={searchTerm} onChange={handleSearch} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleFormSubmit}
        newName={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons onDelete={handleDeletePerson} persons={filteredPersons} />
    </div>
  );
};

export default App;
