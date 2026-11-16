const Countries = ({ countries, onShowCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button
            onClick={() => onShowCountry(country.name.common)}
            type="button"
          >
            Show
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Countries;
