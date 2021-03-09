import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Mars.module.css';
import { formatData, sortByDate } from '../utils/formatter';

const WEATHER_API_URL = `https://api.nasa.gov/insight_weather/?api_key=Q6Zs2bsSa0b2HaMKkiE7DoeN6HdFGZ4CLg4ZrOhv&feedtype=json&ver=1.0`;

async function fetchWeatherData() {
    return await fetch(WEATHER_API_URL).then((data) => data.json());
}

async function fetchImageData() {
    const IMAGE_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=Q6Zs2bsSa0b2HaMKkiE7DoeN6HdFGZ4CLg4ZrOhv`

    return await fetch(IMAGE_API_URL).then((data) => data.json());
}

export default function MarsWeather() {
    const [sols, setSols] = useState([]);
    const [images, setImages] = useState([]);
    const [isMetric, setIsMetric] = useState(true);

    useEffect(() => {
        const fetchFromAPI = async () => {
            const weather = await fetchWeatherData();
            const sols = formatData(weather, isMetric);

            sortByDate(sols);
            setSols(sols);

            const images = await fetchImageData();
            setImages(images);
        };
    
        fetchFromAPI();
    }, [isMetric]);

    const toggleMeasurement = useCallback(() => {
        setIsMetric(isMetric => !isMetric);
    }, [setIsMetric]);

    return (
        <>
            <h1 className={styles.title}>Mars Weather 🛰</h1>
            <p className={styles.description}>Data for the past 7 sols</p>
            <button onClick={toggleMeasurement}>Toggle measurement</button>

            <div className={styles.grid}>
                {sols.map((sol, index) => {
                    const date  = sol.date;
                    const pressure = sol.pressure;
                    const temperature = sol.maxTemp;
                    const windSpeed = sol.windSpeed;
                    const season = sol.season;

                    return (
                        <React.Fragment key={index} >
                            <a className={styles.card}>
                                <h3><strong>Sol </strong>{sol.sol}</h3>
                                <div><strong>Date: </strong>{date}</div>
                                <div><strong>Season: </strong>{season}</div>
                                <div><strong>Atmospheric Pressure: </strong>{pressure} Pa</div>
                                <div><strong>Atmospheric Temperature: </strong>{temperature}</div>
                                <div><strong>Wind Speed: </strong>{windSpeed} km/h</div>
                            </a>
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
}
