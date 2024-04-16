'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, InputLabel, Select, MenuItem } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';

const InsertPatientPage = () => {
  const [_, dispatch] = useNotificationContext();
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);

  const [values, setValues] = useState({
    name: '',
    email: '',
    officeId: '',
    isStrictRadius: true,
    isStrictDuration: true,
  });

  const handleInputChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    const body = values;
    setLoading(true)
    fetch('/api/user', { method: 'POST', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((responseObject) => {
        console.log('SUCCESS!', responseObject)
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menambahkan karyawan ${values.name}`, severity: 'success' } });
        router.replace('/dashboard/employee')
        setLoading(false)
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal menambahkan karyawan, error: ${err}`, severity: 'error' } });
        setLoading(false)
      })
  }

  useEffect(() => {
    fetch(`/api/office/list?page=1&limit=1000`)
      .then((res) => res.json())
      .then((resObject) => {
        setOfficeOptions(resObject)
        setLoading(false)
      })
  }, []);

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Tambah Karyawan | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Tambahkan Karyawan
          </Typography>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '100%', paddingRight: 1 }}>
              <FormControl fullWidth>
                <TextField
                  id="name-input"
                  label="Nama Karyawan"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange('name')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
            <Box sx={{ width: '50%', paddingLeft: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="office-label">Dilarang Clock in / out di luar area</InputLabel>
                <Select
                  labelId="isStrictRadius-label"
                  id="isStrictRadius"
                  label="Dilarang Clock in / out di luar area"
                  value={values.isStrictRadius}
                  onChange={handleInputChange('isStrictRadius')}
                  fullWidth
                >
                  {/* @ts-ignore */}
                  {[{ id: true, name: 'Ya' }, { id: false, name: 'Tidak' }].map((option, index) => (<MenuItem key={index} value={option.id}>{option.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: '50%', paddingLeft: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="office-label">Dilarang Clock in / out kurang dari durasi</InputLabel>
                <Select
                  labelId="isStrictDuration-label"
                  id="isStrictDuration"
                  label="Dilarang Clock in / out kurang dari durasi"
                  value={values.isStrictDuration}
                  onChange={handleInputChange('isStrictDuration')}
                  fullWidth
                >
                  {/* @ts-ignore */}
                  {[{ id: true, name: 'Ya' }, { id: false, name: 'Tidak' }].map((option, index) => (<MenuItem key={index} value={option.id}>{option.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
					</Container>
					
					 <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{
              width: '50%',
              paddingRight: 1
            }}>
              <FormControl fullWidth>
                <TextField
                  id="email-input"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleInputChange('email')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
            <Box sx={{
              width: '50%',
              paddingLeft: 1
            }}>
              <FormControl fullWidth>
                <InputLabel id="office-label">Kantor</InputLabel>
                <Select
                  labelId="office-label"
                  id="office"
                  label="Kantor"
                  value={values.officeId}
                  onChange={handleInputChange('officeId')}
                  fullWidth
                >
                  {officeOptions.map((option, index) => (<MenuItem key={index} value={option.id}>{option.name}</MenuItem>))}
                </Select>
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

InsertPatientPage.isRequireAuth = true;
export default InsertPatientPage;