/* =========================================
   WEATHER DASHBOARD
   Using:
   - Fetch API
   - async/await
   - JSON
   - REST API
========================================= */


/* =========================================
   API URLS
========================================= */

// API used to convert city name into
// latitude and longitude.

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";


// Weather API

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================
   DOM ELEMENTS
========================================= */

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const searchButton =
    document.getElementById("search-button");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const errorText =
    document.getElementById("error-text");

const weatherDashboard =
    document.getElementById("weather-dashboard");

const welcome =
    document.getElementById("welcome");


/* =========================================
   WEATHER DISPLAY ELEMENTS
========================================= */

const cityName =
    document.getElementById("city-name");

const locationDetails =
    document.getElementById("location-details");

const currentTime =
    document.getElementById("current-time");

const weatherIcon =
    document.getElementById("weather-icon");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weather-description");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");

const windDirection =
    document.getElementById("wind-direction");

const pressure =
    document.getElementById("pressure");

const feelsLike =
    document.getElementById("feels-like");

const cloudCover =
    document.getElementById("cloud-cover");

const visibility =
    document.getElementById("visibility");

const windGusts =
    document.getElementById("wind-gusts");


/* =========================================
   FORM SUBMIT EVENT
========================================= */

weatherForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page refresh

        event.preventDefault();


        // Get city entered by user

        const city =
            cityInput.value.trim();


        // Validate input

        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;
        }


        // Fetch weather

        await searchWeather(city);
    }
);


/* =========================================
   MAIN SEARCH FUNCTION
========================================= */

async function searchWeather(city) {

    try {

        // Show loading

        showLoading();


        // Hide previous error

        hideError();


        // Disable search button

        searchButton.disabled = true;


        /* -------------------------------------
           STEP 1:
           GET CITY COORDINATES
        ------------------------------------- */

        const location =
            await getCoordinates(city);


        /* -------------------------------------
           STEP 2:
           GET WEATHER DATA
        ------------------------------------- */

        const weather =
            await getWeatherData(
                location.latitude,
                location.longitude,
                location.timezone
            );


        /* -------------------------------------
           STEP 3:
           DISPLAY WEATHER
        ------------------------------------- */

        displayWeather(
            location,
            weather
        );


        /* -------------------------------------
           STEP 4:
           SAVE LAST SEARCH
        ------------------------------------- */

        localStorage.setItem(
            "lastCity",
            city
        );


    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong while fetching weather data."
        );

    }

    finally {

        // Hide loading

        hideLoading();


        // Enable button

        searchButton.disabled = false;

    }
}


/* =========================================
   GET CITY COORDINATES
========================================= */

async function getCoordinates(city) {

    try {

        const url =
            `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        /*
            Fetch API

            fetch() sends an HTTP request.
        */

        const response =
            await fetch(url);


        /*
            Check HTTP response
        */

        if (!response.ok) {

            throw new Error(
                `Location request failed. Status: ${response.status}`
            );
        }


        /*
            Convert response into JSON

            This demonstrates JSON parsing.
        */

        const data =
            await response.json();


        /*
            Check whether location exists
        */

        if (
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                `City "${city}" was not found. Please check the spelling.`
            );
        }


        /*
            Complex nested JSON object

            data.results[0] contains:

            {
                name,
                latitude,
                longitude,
                country,
                admin1,
                timezone,
                ...
            }
        */

        const location =
            data.results[0];


        return location;

    }

    catch (error) {

        /*
            Re-throw error so that
            searchWeather() can handle it.
        */

        throw error;
    }
}


/* =========================================
   GET WEATHER DATA
========================================= */

async function getWeatherData(
    latitude,
    longitude,
    timezone
) {

    try {

        /*
            Request multiple weather fields.

            current:
            - temperature
            - humidity
            - apparent temperature
            - precipitation
            - weather code
            - cloud cover
            - pressure
            - wind speed
            - wind direction
            - wind gusts

            hourly:
            - visibility
        */

        const url =
            `${WEATHER_API}?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
            `&hourly=visibility` +
            `&timezone=${encodeURIComponent(timezone)}`;


        /*
            Send API request
        */

        const response =
            await fetch(url);


        /*
            Network/API error handling
        */

        if (!response.ok) {

            throw new Error(
                `Weather request failed. Status: ${response.status}`
            );
        }


        /*
            Convert response to JSON
        */

        const data =
            await response.json();


        /*
            Validate response
        */

        if (!data.current) {

            throw new Error(
                "Weather information is unavailable for this location."
            );
        }


        return data;

    }

    catch (error) {

        throw error;
    }
}


/* =========================================
   DISPLAY WEATHER
========================================= */

function displayWeather(
    location,
    weather
) {

    /*
        The weather object contains nested JSON:

        weather
        ├── current
        │   ├── temperature_2m
        │   ├── relative_humidity_2m
        │   ├── apparent_temperature
        │   ├── weather_code
        │   ├── cloud_cover
        │   ├── surface_pressure
        │   ├── wind_speed_10m
        │   ├── wind_direction_10m
        │   └── wind_gusts_10m
        │
        └── hourly
            └── visibility
    */


    const current =
        weather.current;


    /* -------------------------------------
       LOCATION
    ------------------------------------- */

    cityName.textContent =
        location.name;


    let locationText =
        "";


    if (location.admin1) {

        locationText +=
            location.admin1 + ", ";

    }


    if (location.country) {

        locationText +=
            location.country;

    }


    locationDetails.textContent =
        locationText;


    /* -------------------------------------
       TIME
    ------------------------------------- */

    currentTime.textContent =
        `Local Time: ${formatDateTime(
            current.time
        )}`;


    /* -------------------------------------
       TEMPERATURE
    ------------------------------------- */

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    /* -------------------------------------
       WEATHER CONDITION
    ------------------------------------- */

    const condition =
        getWeatherCondition(
            current.weather_code
        );


    weatherDescription.textContent =
        condition.description;


    weatherIcon.textContent =
        condition.icon;


    /* -------------------------------------
       HUMIDITY
    ------------------------------------- */

    humidity.textContent =
        current.relative_humidity_2m;


    /* -------------------------------------
       WIND SPEED
    ------------------------------------- */

    windSpeed.textContent =
        current.wind_speed_10m;


    /* -------------------------------------
       WIND DIRECTION
    ------------------------------------- */

    windDirection.textContent =
        current.wind_direction_10m;


    /* -------------------------------------
       PRESSURE
    ------------------------------------- */

    pressure.textContent =
        Math.round(
            current.surface_pressure
        );


    /* -------------------------------------
       FEELS LIKE
    ------------------------------------- */

    feelsLike.textContent =
        Math.round(
            current.apparent_temperature
        );


    /* -------------------------------------
       CLOUD COVER
    ------------------------------------- */

    cloudCover.textContent =
        current.cloud_cover;


    /* -------------------------------------
       VISIBILITY
    ------------------------------------- */

    /*
        hourly.visibility is an array.

        We use the first value because
        it represents the current hour.
    */

    if (
        weather.hourly &&
        weather.hourly.visibility &&
        weather.hourly.visibility.length > 0
    ) {

        const visibilityMeters =
            weather.hourly.visibility[0];


        const visibilityKm =
            visibilityMeters / 1000;


        visibility.textContent =
            visibilityKm.toFixed(1);

    }

    else {

        visibility.textContent =
            "--";

    }


    /* -------------------------------------
       WIND GUSTS
    ------------------------------------- */

    windGusts.textContent =
        current.wind_gusts_10m;


    /* -------------------------------------
       SHOW DASHBOARD
    ------------------------------------- */

    weatherDashboard.classList.remove(
        "hidden"
    );


    welcome.classList.add(
        "hidden"
    );

}


/* =========================================
   WEATHER CODE PROCESSING
========================================= */

function getWeatherCondition(
    weatherCode
) {

    /*
        Open-Meteo WMO weather codes.

        The API returns a number.

        We convert that number into:
        - description
        - icon
    */


    const weatherCodes = {

        0: {
            description: "Clear sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly cloudy",
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
            description: "Depositing rime fog",
            icon: "🌫️"
        },

        51: {
            description: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense drizzle",
            icon: "🌧️"
        },

        56: {
            description: "Light freezing drizzle",
            icon: "🌧️"
        },

        57: {
            description: "Dense freezing drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight rain",
            icon: "🌧️"
        },

        63: {
            description: "Moderate rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy rain",
            icon: "🌧️"
        },

        66: {
            description: "Light freezing rain",
            icon: "🌧️"
        },

        67: {
            description: "Heavy freezing rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight snowfall",
            icon: "🌨️"
        },

        73: {
            description: "Moderate snowfall",
            icon: "🌨️"
        },

        75: {
            description: "Heavy snowfall",
            icon: "❄️"
        },

        77: {
            description: "Snow grains",
            icon: "❄️"
        },

        80: {
            description: "Slight rain showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate rain showers",
            icon: "🌧️"
        },

        82: {
            description: "Violent rain showers",
            icon: "⛈️"
        },

        85: {
            description: "Slight snow showers",
            icon: "🌨️"
        },

        86: {
            description: "Heavy snow showers",
            icon: "❄️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description:
                "Thunderstorm with slight hail",
            icon: "⛈️"
        },

        99: {
            description:
                "Thunderstorm with heavy hail",
            icon: "⛈️"
        }

    };


    /*
        If the API returns an unknown code,
        show a fallback condition.
    */

    return (
        weatherCodes[weatherCode] || {

            description:
                "Unknown weather condition",

            icon:
                "🌍"

        }
    );
}


/* =========================================
   FORMAT DATE & TIME
========================================= */

function formatDateTime(
    dateTime
) {

    if (!dateTime) {

        return "--";

    }


    /*
        Example:

        2026-09-09T19:00
    */

    const [date, time] =
        dateTime.split("T");


    return `${date} ${time}`;
}


/* =========================================
   SHOW LOADING
========================================= */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

}


/* =========================================
   HIDE LOADING
========================================= */

function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(message) {

    errorText.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );

}


/* =========================================
   HIDE ERROR
========================================= */

function hideError() {

    errorMessage.classList.add(
        "hidden"
    );

}


/* =========================================
   LOAD LAST SEARCHED CITY
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const lastCity =
            localStorage.getItem(
                "lastCity"
            );


        /*
            If a city was previously searched,
            automatically load it.
        */

        if (lastCity) {

            cityInput.value =
                lastCity;

            searchWeather(
                lastCity
            );

        }

    }
);