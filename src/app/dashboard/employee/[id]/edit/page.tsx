'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, InputLabel, Select, MenuItem } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';

import type { Dayjs } from 'dayjs';

const AddEmployeePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [_, dispatch] = useNotificationContext();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);

  const [values, setValues] = useState({
    name: '',
    email: '',
    officeId: ''
  });

  const handleInputChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetch(`/api/user/${id}`)
        .then((res) => res.json())
        .then((responseObject) => {
          fetch(`/api/office/list`)
            .then((res) => res.json())
            .then((resObject) => {
              setOfficeOptions(resObject)
              setLoading(false)
            })
          setValues({
            name: responseObject.name,
            email: responseObject.email,
            officeId: responseObject.officeId,
          });
        })
    }
  }, [id]);

  const handleSubmit = () => {
    setLoading(true)
    const body = values;
    fetch(`/api/user/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((_) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil ubah data karyawan ${values.name}`, severity: 'success' } })
        router.replace('/dashboard/employee')
        setLoading(false)
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal ubah data karyawan, error: ${err}`, severity: 'error' } })
        setLoading(false)
      })
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Ubah Detail Karyawan | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Ubah Data Karyawan
          </Typography>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <Box sx={{ width: '100%' }}>
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

export default AddEmployeePage;