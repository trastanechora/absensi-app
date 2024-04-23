'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, InputAdornment, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';

const InsertDepartementPage = () => {
  const [_, dispatch] = useNotificationContext();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false)

  const [values, setValues] = useState({
    name: '',
  });

  const handleInputChange = (prop: string, type: string) => (event: any) => {
    const newValue = type === 'number' ? Number(event.target.value) : event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const handleSubmit = () => {
    const body = { ...values };
    setLoading(true)
    fetch('/api/division', { method: 'POST', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((responseObject) => {
        if (responseObject.error) {
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal menambahkan departemen, error: ${responseObject.error}`, severity: 'error' } });
          setLoading(false);
          return;
        }

        router.replace('/dashboard/division');
        console.log('SUCCESS!', responseObject);
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menambahkan departemen ${values.name}`, severity: 'success' } });
        setLoading(false);
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal menambahkan departemen, error: ${err}`, severity: 'error' } });
        setLoading(false);
      })
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Tambah Departemen | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Tambahkan Departemen
          </Typography>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <TextField
                  id="name-input"
                  label="Nama Departemen"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange('name', 'string')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
					</Container>
        
          <Divider sx={{ marginBottom: 3 }} />

          <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignSelf: 'center' }}>
              <Button variant="contained" onClick={handleSubmit} disabled={isLoading} sx={{ textTransform: 'none' }}>Simpan</Button>
            </Box>
          </Container>
        </Container>
      </main>
    </div>
  )
}

InsertDepartementPage.isRequireAuth = true;
export default InsertDepartementPage;