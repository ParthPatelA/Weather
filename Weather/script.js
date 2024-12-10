// Ensure DOM is loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "86253551b8e42e3573ca08d5326f1392"; // OpenWeather API Key

    // --------------- INDEX PAGE FUNCTIONALITY--------------  //

    // adds a map on the webpage where the #map div is located
    if (document.body.contains(document.getElementById("map"))) {
        const map = L.map('map').setView([51.505, -0.09], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const searchButton = document.getElementById('searchButton');
        const inputCity = document.getElementById('inputCity');
//      event handler -> when the seach button is created, it searches the city typed in in the searchbox
        searchButton.addEventListener('click', () => {
            const cityName = inputCity.value.trim();
            if (!cityName) {
                alert("Please enter a city name!"); // if user doesn't put any city and just presses search, it will give an alert message.
                return;
            }

            // fetched the searched city in the api, and fetches it using AJAX
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const lat = data.coord.lat;
                        const lon = data.coord.lon;

                        // Update map view and add marker to the city
                        map.setView([lat, lon], 10);
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<b>${cityName}</b><br>Latitude: ${lat}<br>Longitude: ${lon}`)
                            .openPopup();

                        // Display weather information
                        document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`.toUpperCase();
                        document.getElementById("conditions").innerText = `Conditions: ${data.weather[0].description}`.toUpperCase();
                        document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`.toUpperCase();
                        document.getElementById("windSpeed").innerText = `Wind Speed: ${data.wind.speed} km/h`.toUpperCase();
                    } else {
                        alert("City not found. Try again.");
                    }
                }) // is there is an error fetching the data, or the city typed doesn't exists.
                .catch(err => {
                    console.error("Error fetching weather data:", err);
                    alert("Unable to fetch weather data. Please try again.");
                });
        });
    }

    // ----------- SAVE PAGE FUNCTIONALITY ----------- //

    if (document.body.contains(document.getElementById("savedCities"))) {
        const addButton = document.getElementById('addButton');
        const inputSavedCity = document.getElementById('inputSavedCity');
        const savedCitiesList = document.getElementById('savedCities');

        // event listener for save button, trigger the function where it will save the city's weather info in a list.
        addButton.addEventListener('click', () => {
            const cityName = inputSavedCity.value.trim();
            if (!cityName) { // if user doesn't enter anything.
                alert("Please enter a city name!");
                return;
            }

            // fetches from the API using AJAX
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const lat = data.coord.lat;
                        const lon = data.coord.lon;

                        // Create list item for the saved city
                        const li = document.createElement("li");
                        // in the list it will have all the weather info.
                        li.innerHTML = `  
                            <strong>${cityName}</strong>:
                            Temperature: ${data.main.temp}°C,
                            Conditions: ${data.weather[0].description.toUpperCase()},
                            Humidity: ${data.main.humidity}%
                        `;
                        savedCitiesList.appendChild(li); // it will keep appending it for each city saved in a list.
                    } else {
                        alert("City not found. Try again."); // if the city is not found.
                    }
                })
                // If there are any error fetching the data.
                .catch(err => {
                    console.error("Error fetching weather data:", err);
                    alert("Unable to fetch weather data. Please try again.");
                });
        });
    }

    // ----------------- FORECAST PAGE FUNCTIONALITY ------------------- //

    if (document.body.contains(document.getElementById("forecastSection"))) {
        // gets all the info about the where the divs are.
    const forecastButton = document.getElementById("forecastButton");
    const forecastInput = document.getElementById("forecastInput");
    const forecastCards = document.getElementById("forecastCards");
    const cityDisplay = document.getElementById("cityDisplay");

    // When searching a city
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
                    updateCityDisplay(cityName); //updates the displays 
                    updateForecastCards(data.list); //upates the card
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

    // It will show the forecast of 5 days
    // Update the forecast cards
    function updateForecastCards(forecastList) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // depending on the day user searches, It will show starting that day,
        let dayIndex = new Date().getDay();                                                          // So if user searches on Tuesday, it will display the forecast of the next 5 days starting Tuesday.

        // Clear previous forecast cards
        const dayCards = forecastCards.querySelectorAll(".dayCard");
        dayCards.forEach(card => card.innerHTML = "");

        // Populate new forecast data
        for (let i = 0; i < 7; i++) {
            const forecast = forecastList[i * 8]; // Every 8th index gives roughly a day apart
            if (forecast) {
                // the information on each card
                const card = dayCards[i];
                const iconCode = forecast.weather[0].icon; // the weather icon based on the forecast.
                const temperature = forecast.main.temp.toFixed(1).toUpperCase(1);
                const description = forecast.weather[0].description.toUpperCase();

                card.innerHTML = 
                // the icon for the forecast is also taken from openweather, where I got my API
                `
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
