import Head from 'next/head';
import { useCallback, useState } from 'react';
import styles from '../styles/Home.module.css';
import SpacexLaunches from '../components/SpacexLaunches.js';
import MarsWeather from '../components/MarsWeather.js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import PropTypes from 'prop-types';

function Home({ upcomingLaunches, pastLaunches }) {
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
        <button onClick={increment}>View {toggle ? "Mars Weather" : "Spacex Launches"}</button>
        {toggle 
          ? <SpacexLaunches upcomingLaunches={upcomingLaunches} pastLaunches={pastLaunches} /> 
          : <MarsWeather />
        }
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
        <a href="https://github.com/sjouk" target="_blank" style={{'marginLeft': "0.5em"}}>& made by Sjouk</a>
      </footer>
    </div>
  )
}

Home.propTypes = {
  upcomingLaunches: PropTypes.array,
  pastLaunches: PropTypes.array
}

export default Home;

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const fakeData = await fetch('https://api.nasa.gov/insight_weather/?api_key=G77jW0hWvdHZaX6fgqiw45ooGbOcewCIEAXofKzy&feedtype=json&ver=1.0');
  const data1 = fakeData.json();

  console.log(data1);

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
