'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, InputAdornment, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';

const InputMap = dynamic(() => import('@/components/input-map'), { ssr: false, loading: () => <Skeleton variant="rectangular" width="100%" height={356} /> });

const EditOfficePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [_, dispatch] = useNotificationContext()
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(false)

  const [values, setValues] = useState({
    name: '',
    radius: 0,
    duration: 0,
    lat: 0,
    long: 0,
  });

  const handleInputChange = (prop: string, type: string) => (event: any) => {
    const newValue = type === 'number' ? Number(event.target.value) : event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const handleOnLocationChange = (newValue: number[]) => {
    setValues(prev => ({ ...prev, lat: newValue[0], long: newValue[1] }));
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/office/${id}`)
        .then((res) => res.json())
        .then((responseObject) => {
          setLoading(false);
          setValues({ ...responseObject, duration: responseObject.duration / 60 / 60 / 1000 });
        })
    }
  }, [id]);

  const handleSubmit = () => {
    setLoading(true)
    const body = { ...values, duration: values.duration * 60 * 60 * 1000 };
    fetch(`/api/office/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((_) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil ubah data lokasi ${values.name}`, severity: 'success' } })
        router.replace('/dashboard/office')
        setLoading(false)
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal ubah data lokasi, error: ${err}`, severity: 'error' } })
        setLoading(false)
      })
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Ubah Detail Lokasi | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Ubah Data Lokasi
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
            <Box sx={{ width: '50%', marginRight: 1 }}>
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
            <Box sx={{ width: '50%', marginLeft: 1 }}>
              <FormControl fullWidth>
                <TextField
                  id="duration-input"
                  label="Durasi (dalam jam)"
                  name="duration"
                  type='number'
                  value={values.duration}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">jam</InputAdornment>
                  }}
                  onChange={handleInputChange('duration', 'number')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
          </Container>

          <Container disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <InputMap setCurrentPayload={handleOnLocationChange} coords={[values.lat, values.long]} />
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

export default EditOfficePage;