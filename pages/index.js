import Head from 'next/head';
import { useCallback, useState } from 'react';
import styles from '../styles/Home.module.css';
import SpacexLaunches from '../components/SpacexLaunches.js';
import MarsWeather from '../components/MarsWeather.js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ marsWeather, upcomingLaunches, pastLaunches }) {

  // console.log(marsWeather);

  const [toggle, setToggle] = useState(0);

  const increment = useCallback(() => {
    setToggle((v) => v + 1)
  }, [setToggle]);

  console.log(toggle);

  return (
    <div className={styles.container}>
      <Head>
        <title>Spacex Launch Tracker</title>
        <link rel="icon" href="/favicon_io/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={increment}>Click Me! {toggle}</button>
        <MarsWeather marsWeather={marsWeather} />
        {toggle > 5 && <SpacexLaunches upcomingLaunches={upcomingLaunches} pastLaunches={pastLaunches} />}
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
  const res = await fetch('https://api.nasa.gov/insight_weather/?api_key=G77jW0hWvdHZaX6fgqiw45ooGbOcewCIEAXofKzy&feedtype=json&ver=1.0');
  const marsData = await res.json();

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
      pastLaunches: data.launchesPast,
      marsWeather: marsData
    }
  }
}
