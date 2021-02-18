import styles from '../styles/Home.module.css';

export default function SpacexLaunches({ upcomingLaunches, pastLaunches }) {

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

// export async function getStaticProps() {
//     const client = new ApolloClient({
//       uri: 'https://api.spacex.land/graphql/',
//       cache: new InMemoryCache()
//     });
  
//     const { data } = await client.query({
//       query: gql`
//         query GetLaunches {
//           launchesUpcoming(limit: 3) {
//             id
//             mission_name
//             launch_date_local
//             launch_site {
//               site_name_long
//             }
//             rocket {
//               rocket_name
//             }
//           }
//           launchesPast(limit: 6) {
//             id
//             mission_name
//             launch_date_local
//             launch_success
//             launch_site {
//               site_name_long
//             }
//             links {
//               article_link
//               video_link
//               mission_patch
//             }
//             rocket {
//               rocket_name
//             }
//           }
//         }
//       `
//     });

//     return {
//         props: {
//             upcomingLaunches: data.launchesUpcoming,
//             pastLaunches: data.launchesPast,
//         }
//     }
// }