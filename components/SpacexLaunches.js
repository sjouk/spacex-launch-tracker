import styles from '../styles/Home.module.css';
import PropTypes from 'prop-types';

function SpacexLaunches({ upcomingLaunches, pastLaunches }) {
    console.log(upcomingLaunches);

    pastLaunches = pastLaunches.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i).sort((a, b) => { 
        return new Date(b.launch_date_local) - new Date(a.launch_date_local); 
    });

    upcomingLaunches = upcomingLaunches.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i).sort((a, b) => {
        return new Date(b.launch_date_local) - new Date(a.launch_date_local);
    });

    return (
        <>
            <h1 className={styles.title}>SpaceX Launches 🚀</h1>
            <p className={styles.description}>Latest launches from SpaceX</p>

            <h2>Upcoming Launches</h2>
            <div className={styles.grid}>
                {upcomingLaunches.map((launch, key) => {
                    return (
                        <a key={key} className={styles.card}>
                            <h3>{ launch.mission_name}</h3>
                            <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
                            <p><strong>Rocket Name:</strong> { launch.rocket.rocket_name }</p>
                            <p><strong>Launch Site:</strong> { launch.launch_site.site_name_long }</p>
                        </a>
                    );
                })}
            </div>

            <h2>Past Launches</h2>
            <div className={styles.grid}>
            {pastLaunches.map((launch, key) => {
                return (
                <a key={key} href={launch.links.video_link} className={styles.card}>
                    <h3>{ launch.mission_name }</h3>
                    <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
                    <p><strong>Rocket Name:</strong> { launch.rocket.rocket_name }</p>
                    <p><strong>Launch Site:</strong> { launch.launch_site.site_name_long }</p>
                    {launch.launch_success ? <p className={styles.statusSuccess}>Launch succeeded</p> : <p className={styles.statusFailure}>Launch failed</p>}
                </a>
                );
            })}
            </div>
        </>
    )
}

SpacexLaunches.propTypes = {
    upcomingLaunches: PropTypes.array,
    pastLaunches: PropTypes.array
}

export default SpacexLaunches;
