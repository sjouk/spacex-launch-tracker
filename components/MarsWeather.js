import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Mars.module.css';
import { formatData, sortByDate } from '../utils/formatter';
import WeatherCard from './WeatherCard';

const WEATHER_API_URL = `https://api.nasa.gov/insight_weather/?api_key=${process.env.REACT_APP_API_KEY}&feedtype=json&ver=1.0`;

async function fetchWeatherData() {
    return await fetch(WEATHER_API_URL).then((data) => data.json());
}

async function fetchImageData(sols) {
    const imageArray = [];
    for (let i = 0; i < sols.length; i++) {
        const currSol = sols[i].sol;
        console.log(sols);
        const IMAGE_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${currSol}&api_key=${process.env.REACT_APP_API_KEY}`
        const image = await fetch(IMAGE_API_URL).then((data) => data.json());
        imageArray.push(image);
    }

    return imageArray;
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

            // const images = await fetchImageData(sols);
            // setImages(images);
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
                    return <WeatherCard sol={sol} key={index} />;
                })}
            </div>
        </>
    );
}
