'use client';

import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Image from 'next/image';

import logo from '../../public/logos/company.png';

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Selamat datang
        </h1>

        <Image
          src={logo}
          priority
          alt="Logo"
          className="h-10 w-10 rounded-full"
          width={256}
          height={144}
        />

        <p className={styles.description}>
          Sistem Manajemen Absensi
        </p>

        <Box sx={{ display: 'flex' }}>
          <Button variant="outlined" onClick={() => router.push('/login')} sx={{ textTransform: 'none', marginLeft: 1 }}>Masuk</Button>
        </Box>
      </main>

      <footer className={styles.footer}>
        Made with Love by
        <a
          href="https://www.linkedin.com/in/trastanechora/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mae
        </a>
      </footer>
    </div>
  )
}

export default Home