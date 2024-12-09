// Ensure DOM is loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "86253551b8e42e3573ca08d5326f1392"; // OpenWeather API Key

    // ===== INDEX PAGE FUNCTIONALITY ===== //
    if (document.body.contains(document.getElementById("map"))) {
        const map = L.map('map').setView([51.505, -0.09], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const searchButton = document.getElementById('searchButton');
        const inputCity = document.getElementById('inputCity');

        searchButton.addEventListener('click', () => {
            const cityName = inputCity.value.trim();
            if (!cityName) {
                alert("Please enter a city name!");
                return;
            }

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const lat = data.coord.lat;
                        const lon = data.coord.lon;

                        // Update map view and add marker
                        map.setView([lat, lon], 10);
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<b>${cityName}</b><br>Latitude: ${lat}<br>Longitude: ${lon}`)
                            .openPopup();

                        // Display weather information
                        document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
                        document.getElementById("conditions").innerText = `Conditions: ${data.weather[0].description}`;
                        document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
                        document.getElementById("windSpeed").innerText = `Wind Speed: ${data.wind.speed} km/h`;
                    } else {
                        alert("City not found. Try again.");
                    }
                })
                .catch(err => {
                    console.error("Error fetching weather data:", err);
                    alert("Unable to fetch weather data. Please try again.");
                });
        });
    }

    // ===== SAVE PAGE FUNCTIONALITY ===== //
    if (document.body.contains(document.getElementById("savedCities"))) {
        const addButton = document.getElementById('addButton');
        const inputSavedCity = document.getElementById('inputSavedCity');
        const savedCitiesList = document.getElementById('savedCities');

        addButton.addEventListener('click', () => {
            const cityName = inputSavedCity.value.trim();
            if (!cityName) {
                alert("Please enter a city name!");
                return;
            }

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const lat = data.coord.lat;
                        const lon = data.coord.lon;

                        // Create list item for the saved city
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <strong>${cityName}</strong>:
                            Temperature: ${data.main.temp}°C,
                            Conditions: ${data.weather[0].description.toUpperCase()},
                            Humidity: ${data.main.humidity}%
                        `;
                        savedCitiesList.appendChild(li);
                    } else {
                        alert("City not found. Try again.");
                    }
                })
                .catch(err => {
                    console.error("Error fetching weather data:", err);
                    alert("Unable to fetch weather data. Please try again.");
                });
        });
    }

    // ===== FORECAST PAGE FUNCTIONALITY ===== //
    if (document.body.contains(document.getElementById("forecastSection"))) {
    const forecastButton = document.getElementById("forecastButton");
    const forecastInput = document.getElementById("forecastInput");
    const forecastCards = document.getElementById("forecastCards");
    const cityDisplay = document.getElementById("cityDisplay");

    forecastButton.addEventListener("click", () => {
        const cityName = forecastInput.value.trim();
        if (!cityName) {
            alert("Please enter a city name!");
            return;
        }

        // Fetch forecast data
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    updateCityDisplay(cityName);
                    updateForecastCards(data.list);
                } else {
                    alert("City not found. Please try again.");
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                alert("Failed to fetch forecast data. Please try again later.");
            });
    });

    // Update the city display section
    function updateCityDisplay(cityName) {
        cityDisplay.innerHTML = `
            <h3>${cityName}</h3>
        `;
    }

    // Update the forecast cards
    function updateForecastCards(forecastList) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayIndex = new Date().getDay();

        // Clear previous forecast cards
        const dayCards = forecastCards.querySelectorAll(".dayCard");
        dayCards.forEach(card => card.innerHTML = "");

        // Populate new forecast data
        for (let i = 0; i < 7; i++) {
            const forecast = forecastList[i * 8]; // Every 8th index gives roughly a day apart
            if (forecast) {
                const card = dayCards[i];
                const iconCode = forecast.weather[0].icon;
                const temperature = forecast.main.temp.toFixed(1).toUpperCase(1);
                const description = forecast.weather[0].description.toUpperCase();

                card.innerHTML = `
                    <div class="weatherIcon">
                        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}">
                    </div>
                    <div class="dayDetails">
                        <h4>${days[(dayIndex + i) % 7]}</h4>
                        <p>${temperature}°C</p>
                        <p>${description}</p>
                    </div>
                `;
            }
        }
    }
    }
});
