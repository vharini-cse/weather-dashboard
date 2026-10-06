// ========================================
// WEATHER DASHBOARD - JAVASCRIPT
// ========================================

// Get HTML elements
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const dayStatus = document.getElementById("dayStatus");

const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");


// ========================================
// WEATHER CONDITION
// ========================================

function getWeatherInfo(weatherCode) {

    const weatherConditions = {
        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Depositing Rime Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight Rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight Snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Slight Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Violent Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Thunderstorm with Heavy Hail",
            icon: "⛈️"
        }
    };

    return weatherConditions[weatherCode] || {
        description: "Unknown Weather",
        icon: "🌍"
    };
}


// ========================================
// SEARCH WEATHER
// ========================================

weatherForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    // Clear previous error
    errorMessage.textContent = "";

    // Check empty input
    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});


// ========================================
// GET WEATHER
// ========================================

async function getWeather(city) {

    try {

        // Show loading
        loading.style.display = "block";

        // Hide previous error
        errorMessage.textContent = "";


        // ====================================
        // STEP 1: GET CITY COORDINATES
        // ====================================

        const locationURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationURL);

        if (!locationResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const locationData = await locationResponse.json();


        // Check if city exists
        if (!locationData.results || locationData.results.length === 0) {
            throw new Error(
                "City not found. Please enter a valid city name."
            );
        }


        // Get location information
        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // ====================================
        // STEP 2: GET WEATHER DATA
        // ====================================

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error(
                "Unable to retrieve weather information."
            );
        }

        const weatherData = await weatherResponse.json();


        // ====================================
        // STEP 3: DISPLAY WEATHER
        // ====================================

        const currentWeather = weatherData.current;

        const weatherInfo =
            getWeatherInfo(currentWeather.weather_code);


        // Location
        cityName.textContent = location.name;

        countryName.textContent =
            `${location.country || "Unknown Country"}`;


        // Temperature
        temperature.textContent =
            Math.round(currentWeather.temperature_2m);


        // Feels like
        feelsLike.textContent =
            Math.round(currentWeather.apparent_temperature);


        // Humidity
        humidity.textContent =
            currentWeather.relative_humidity_2m;


        // Wind
        windSpeed.textContent =
            Math.round(currentWeather.wind_speed_10m);


        // Weather condition
        weatherDescription.textContent =
            weatherInfo.description;


        // Weather icon
        weatherIcon.textContent =
            weatherInfo.icon;


        // Day / Night
        dayStatus.textContent =
            currentWeather.is_day === 1
                ? "Day"
                : "Night";

    }


    // ====================================
    // ERROR HANDLING
    // ====================================

    catch (error) {

        console.error("Weather Error:", error);

        errorMessage.textContent =
            error.message ||
            "Something went wrong. Please try again.";
    }


    // ====================================
    // FINALLY
    // ====================================

    finally {

        loading.style.display = "none";
    }
}


// ========================================
// LOAD DEFAULT CITY
// ========================================

getWeather("Chennai");