'use client';

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css'

const EmployeeDetailPage = ({ params }: { params: { id: string } }) => {
  const [_, dispatch] = useNotificationContext();
  const [isLoading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const { id } = params;

  const router = useRouter();

  const handleResetPassword = () => {
    fetch(`/api/user/${id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Reset password berhasil, password untuk karyawan kembali ke setelan semula`, severity: 'success' } });
        } else {
          const { error } = await res.json();
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal reset password, Error: ${error}`, severity: 'error' } });
        }
      });
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/user/${id}`)
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
        <title>Detail Karyawan | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Detail Karyawan
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Nama Karyawan:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.name}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Email:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {detail.email}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Lokasi:
          </Typography>
          <Typography sx={{ fontWeight: '500' }} variant="body1" gutterBottom>
            {detail.office?.name}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', marginBottom: 2 }}>
          <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
            Clock in/out di luar radius:
          </Typography>
          <Typography sx={{ fontWeight: '500' }} variant="body1" gutterBottom>
            {detail.isStrict ? 'Tidak' : 'Ya'}
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: 3 }} />
        <Button
          onClick={handleResetPassword}
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Reset Password
        </Button>
      </main>
    </div>
  )
}

export default EmployeeDetailPage;