import Countries from "./Countries";
import Country from "./Country";

const Content = ({ countries, onShowCountry }) => {
  const count = countries.length;

  if (count > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (count <= 10 && count > 1) {
    return <Countries countries={countries} onShowCountry={onShowCountry} />;
  }

  if (count === 1) {
    return <Country country={countries[0]} />;
  }

  return null;
};

export default Content;
