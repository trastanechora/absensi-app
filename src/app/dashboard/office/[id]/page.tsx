'use client';

import Head from 'next/head'
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';

import styles from '@/styles/Dashboard.module.css'

const ViewMap = dynamic(() => import('@/components/view-map'), { ssr: false, loading: () => <Skeleton variant="rectangular" width="100%" height={356} /> });

const OfficeDetailPage = ({ params }: { params: { id: string } }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/office/${id}`)
        .then((res) => res.json())
        .then((responseObject) => {
          setLoading(false);
          setDetail(responseObject);
        })
    }
  }, [id]);

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Detail Lokasi | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Detail Lokasi
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Nama Lokasi:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.name}
          </Typography>
        </Box>
        

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Radius:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.radius} meter
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Durasi:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.duration / 60 / 60 / 1000} Jam
          </Typography>
        </Box>

        <Container disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
          {detail && <ViewMap coords={[detail.lat, detail.long]} radius={detail.radius} />}
        </Container>
        <Divider sx={{ marginBottom: 3 }} />
      </main>
    </div>
  )
}

export default OfficeDetailPage;