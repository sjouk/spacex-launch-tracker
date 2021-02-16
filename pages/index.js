import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ upcomingLaunches, pastLaunches }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spacex Launch Tracker</title>
        <link rel="icon" href="/favicon_io/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches 🚀</h1>
        <p className={styles.description}>Latest launches from SpaceX</p>

        <h2>Upcoming Launches</h2>
        <div className={styles.grid}>
          {upcomingLaunches.sort((a, b) => { 
            return new Date(b.launch_date_local) - new Date(a.launch_date_local); 
          }).map((launch, key) => {
            return (
              <a key={key} className={styles.card}>
                <h3>{ launch.mission_name}</h3>
                <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
              </a>
            );
          })}
        </div>

        <h2>Past Launches</h2>
        <div className={styles.grid}>
          {pastLaunches.sort((a, b) => { 
            return new Date(b.launch_date_local) - new Date(a.launch_date_local); 
          }).map((launch, key) => {
            return (
              <a key={key} href={launch.links.video_link} className={styles.card}>
                <h3>{ launch.mission_name }</h3>
                <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
                {launch.launch_success ? <div>Launch succeeded</div> : <div>Launch failed</div>}
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesUpcoming(limit: 3) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          rocket {
            rocket_name
          }
        }
        launchesPast(limit: 6) {
          id
          mission_name
          launch_date_local
          launch_success
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });

  return {
    props: {
      upcomingLaunches: data.launchesUpcoming,
      pastLaunches: data.launchesPast
    }
  }
}
