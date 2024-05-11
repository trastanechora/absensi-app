'use client';

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';

import { convertDateToLocaleString } from '@/app/lib/date';
import { convertDateToTime } from '@/app/lib/time';
import styles from '@/styles/Dashboard.module.css'

const PresenceDetailPage = ({ params }: { params: { id: string } }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/presence/${id}`)
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
        <title>Detail Absensi | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Detail Absensi
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Nama Karyawan:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.user?.name}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Lokasi:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.office?.name || <> - Lokasi telah dihapus -</>}
          </Typography>
        </Box>
         <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Durasi:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.duration}
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: 3 }} />

        <Typography sx={{ paddingBottom: 0 }} variant="h6" display="block" color="primary" gutterBottom>
          Clock In:
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Tanggal:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {convertDateToLocaleString(new Date(detail.clockInDate))}
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Waktu:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {convertDateToTime(new Date(detail.clockInDate))}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Jarak ke Titik Lokasi:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {detail.clockInDistance}m
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Foto:
            </Typography>
            <Box sx={{ width: '200px', height: '300px' }}>
              <img src={detail.clockInPhoto} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto' }} alt="Clock in photo" />
            </Box>
          </Box>
        </Box>

        <Typography sx={{ paddingBottom: 0 }} variant="h6" display="block" color="primary" gutterBottom>
          Clock Out:
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Tanggal:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {convertDateToLocaleString(new Date(detail.clockOutDate))}
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Waktu:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {convertDateToTime(new Date(detail.clockOutDate))}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Jarak ke Titik Lokasi:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {detail.clockOutDistance}m
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
              Foto:
            </Typography>
            <Box sx={{ width: '200px', height: '300px' }}>
              <img src={detail.clockOutPhoto} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto' }} alt="Clock out photo" />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ marginBottom: 3 }} />
      </main>
    </div>
  )
}

export default PresenceDetailPage;