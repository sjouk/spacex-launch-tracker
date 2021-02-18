import Head from 'next/head';
import { useCallback, useState } from 'react';
import styles from '../styles/Home.module.css';
import SpacexLaunches from '../components/SpacexLaunches.js';
import MarsWeather from '../components/MarsWeather.js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ solArray, solNumbers, upcomingLaunches, pastLaunches }) {
  const [toggle, setToggle] = useState(false);
  const [background_color, setBackgroundColor] = useState('#F3EDE2');

  const increment = useCallback(() => {
    setToggle(toggle => !toggle);
    setBackgroundColor(background_color => background_color === '#f1faee' ? '#F3EDE2' : '#f1faee');
  }, [setToggle, setBackgroundColor]);

  return (
    <div className={styles.container} style={{background: background_color}}>
      <Head>
        <title>Space Tracker</title>
        <link rel="icon" href="/favicon_io/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={increment}>Toggle</button>
        {toggle 
          ? <SpacexLaunches upcomingLaunches={upcomingLaunches} pastLaunches={pastLaunches} /> 
          : <MarsWeather solArray={solArray} solNumbers={solNumbers} />
        }
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}     
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
        <a href="https://github.com/sjouk" target="_blank" style={{'margin-left': "0.5em"}}>& made by Sjouk</a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://api.nasa.gov/insight_weather/?api_key=G77jW0hWvdHZaX6fgqiw45ooGbOcewCIEAXofKzy&feedtype=json&ver=1.0');
  const marsData = await res.json();
  const solNumbers = Object.keys(marsData).map(function(k) { return marsData[k] }).slice(7, 8);
  const solArray = Object.keys(marsData).map(function(k) { return marsData[k] }).slice(0, 7);

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
      solNumbers: solNumbers,
      solArray: solArray
    }
  }
}
