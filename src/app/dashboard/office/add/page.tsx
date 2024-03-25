'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, InputAdornment } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';
// import InputMap from '@/components/input-map';

const InsertPatientPage = () => {
  const [_, dispatch] = useNotificationContext();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false)

  const [values, setValues] = useState({
    name: '',
    radius: 0,
    lat: 0,
    long: 0,
  });

  const handleInputChange = (prop: string, type: string) => (event: any) => {
    const newValue = type === 'number' ? Number(event.target.value) : event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const handleSubmit = () => {
    const body = values;
    setLoading(true)
    fetch('/api/office', { method: 'POST', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((responseObject) => {
        console.log('SUCCESS!', responseObject)
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menambahkan lokasi ${values.name}`, severity: 'success' } })
        router.replace('/dashboard/office')
        setLoading(false)
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal menambahkan lokasi, error: ${err}`, severity: 'error' } })
        setLoading(false)
      })
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Tambah Lokasi | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Tambahkan Lokasi
          </Typography>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <TextField
                  id="name-input"
                  label="Nama Lokasi"
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

          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <TextField
                  id="radius-input"
                  label="Radius (dalam meter)"
                  name="radius"
                  type='number'
                  value={values.radius}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>
                  }}
                  onChange={handleInputChange('radius', 'number')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
          </Container>

          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '50%', paddingRight: 2 }}>
              <FormControl fullWidth>
                <TextField
                  id="latitude-input"
                  label="Latitude"
                  name="lat"
                  type='number'
                  value={values.lat}
                  onChange={handleInputChange('lat', 'string')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
            <Box sx={{ width: '50%', paddingLeft: 2 }}>
              <FormControl fullWidth>
                <TextField
                  id="longitude-input"
                  label="Longitude"
                  name="long"
                  type='number'
                  value={values.long}
                  onChange={handleInputChange('long', 'string')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
          </Container>

          {/* <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <InputMap setCurrentPayload={() => {}} />
          </Container> */}
        
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

InsertPatientPage.isRequireAuth = true;
export default InsertPatientPage;