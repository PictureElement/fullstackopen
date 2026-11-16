const Person = ({ person, onClick }) => (
  <li>
    {person.name} {person.number}
    <button onClick={onClick} type="button">
      delete
    </button>
  </li>
);

const Persons = ({ persons, onDelete }) => {
  return persons.length > 0 ? (
    <ul>
      {persons.map((person) => (
        <Person
          onClick={() => onDelete(person.id)}
          key={person.id}
          person={person}
        />
      ))}
    </ul>
  ) : (
    <div>No contacts found</div>
  );
};

export default Persons;
