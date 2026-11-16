const Filter = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div>
      find countries: <input value={searchTerm} onChange={onSearchTermChange} />
    </div>
  );
};

export default Filter;
