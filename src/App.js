import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(
    JSON.parse(localStorage.getItem("weather")) || []
  );
  // const [cities, setCities] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  const getWeather = async () => {
    try {
      const response = await axios.get(url);

      const existingCity = weather.find(
        (w) => w.name.toLowerCase() === response.data.name.toLowerCase()
      );
      if (existingCity) {
        setError("City Already Added!");
        return;
      }
      setCity("");

      setWeather((prev) => {
        return [...prev, response.data];
      });
      setError("");
      return response.data;
    } catch (error) {
      setError("City Not Found!");
      return error;
    }
  };

  const handleDelete = (id) => {
    setWeather((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  useEffect(() => {
    localStorage.setItem("weather", JSON.stringify(weather));
  }, [weather]);

  return (
    <div className="App">
      <h1 className="app_heading">Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {weather.length > 0 &&
          weather.map((el, i) => (
            <WeatherCard key={i} weather={el} handleDelete={handleDelete} />
          ))}
      </div>
    </div>
  );
}

export default App;
