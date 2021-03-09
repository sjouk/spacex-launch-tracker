import React from 'react';
import styles from '../styles/Mars.module.css';

function WeatherCard({ sol }) {
    const date  = sol.date;
    const pressure = sol.pressure;
    const temperature = sol.maxTemp;
    const windSpeed = sol.windSpeed;
    const season = sol.season;

    return (
        <React.Fragment>
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
}

export default WeatherCard;
