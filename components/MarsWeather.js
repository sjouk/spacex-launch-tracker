import styles from '../styles/Mars.module.css';

export default function MarsWeather({ solArray, solNumbers }) {
    solArray = solArray.sort((a, b) => new Date(b.First_UTC) - new Date(a.First_UTC));
    solNumbers = solNumbers[0].reverse();

    return (
        <>
            <h1 className={styles.title}>Mars Weather 🛰</h1>
            <p className={styles.description}>Data for the past 7 sols</p>

            <div className={styles.grid}>
                {solArray.map((sol, key) => {
                    console.log(sol);
                    return (
                        <a key={key} className={styles.card}>
                            <h3><strong>Sol </strong>{solNumbers[key]}</h3>
                            <div><strong>Date: </strong>{new Date(sol.First_UTC).toLocaleDateString("en-US")}</div>
                            <div><strong>Atmospheric Temperature: </strong>{sol.PRE.av} C</div>
                        </a>
                    );
                })}
            </div>
        </>
    );
}
