import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Content from "./components/Content";
import countryService from "./services/countries";

function App() {
  // 1. State
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Derived state
  const trimmedSearch = searchTerm.trim().toLowerCase();
  const filteredCountries =
    trimmedSearch === ""
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(trimmedSearch),
        );

  // 3. Effects
  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
  }, []); // Runs only after the first render

  // 4.  Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowCountry = (commonName) => {
    setSearchTerm(commonName);
  };

  // 5. Render
  return (
    <div>
      <Filter searchTerm={searchTerm} onSearchTermChange={handleSearch} />
      <Content
        countries={filteredCountries}
        onShowCountry={handleShowCountry}
      />
    </div>
  );
}

export default App;
