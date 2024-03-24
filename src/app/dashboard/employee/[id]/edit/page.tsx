'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider, Container, TextField, FormControl, Button, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNotificationContext } from '@/context/notification';
import styles from '@/styles/Dashboard.module.css';

import type { Dayjs } from 'dayjs';

const InsertDoctorPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [_, dispatch] = useNotificationContext()
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [datePickerBirthValue, setDatePickerBirthValue] = useState<Dayjs | null>(dayjs());
  const [datePickerStartValue, setDatePickerStartValue] = useState<Dayjs | null>(dayjs());

  const [values, setValues] = useState<any>({
    name: '',
    email: '',
    phone: '',
    gender: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    info: '',
    doctorSchedule: {
      monday: {
        isChecked: false,
        time: ''
      },
      tuesday: {
        isChecked: false,
        time: ''
      },
      wednesday: {
        isChecked: false,
        time: ''
      },
      thursday: {
        isChecked: false,
        time: ''
      },
      friday: {
        isChecked: false,
        time: ''
      },
      saturday: {
        isChecked: false,
        time: ''
      },
      sunday: {
        isChecked: false,
        time: ''
      }
    },
    photo: '-',
    status: 'active',
    licenseNumber: '',
    paraf: '-',
    serviceStartDate: '',
  });
  const handleInputChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleScheduleChecked = (event: any) => {
    const name: string = event.target.name
    setValues({
      ...values, doctorSchedule: {
        ...values.doctorSchedule,
        [name]: {
          ...values.doctorSchedule[name],
          isChecked: event.target.checked
        }
      }
    });
  };

  const handleScheduleTime = (event: any) => {
    const name: string = event.target.name
    setValues({
      ...values, doctorSchedule: {
        ...values.doctorSchedule,
        [name]: {
          ...values.doctorSchedule[name],
          time: event.target.value
        }
      }
    });
  };

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetch(`/api/user?id=${id}`)
        .then((res) => res.json())
        .then((responseObject) => {
          console.warn('responseObject', responseObject)
          setLoading(false)
          setValues({
            name: responseObject.name,
            email: responseObject.email,
          });
        })
    }
  }, [id]);

  const handleSubmit = () => {
    setLoading(true)
    const body = {
      ...values,
      dateOfBirth: datePickerBirthValue?.format('YYYY-MM-DD'),
      serviceStartDate: datePickerStartValue?.format('YYYY-MM-DD'),
    }
    fetch(`/api/doctor/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((responseObject) => {
        console.log('SUCCESS!', responseObject)
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil ubah data dokter ${values.name}`, severity: 'success' } })
        router.replace('/doctor')
        setLoading(false)
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal ubah data dokter, error: ${err}`, severity: 'error' } })
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
                <TextField
                  id="phone-input"
                  label="Nomor HP"
                  name="phone"
                  value={values.phone}
                  onChange={handleInputChange('phone')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                />
              </FormControl>
            </Box>
          </Container>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <FormControl fullWidth>
              <TextField
                id="info-input"
                label="Informasi Umum"
                name="info"
                value={values.info}
                onChange={handleInputChange('info')}
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rows={3}
                maxRows={6}
                disabled={isLoading}
              />
            </FormControl>
          </Container>
          <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 3 }}>
            <FormControl fullWidth>
              <TextField
                id="address-input"
                label="Alamat Tempat Tinggal Sekarang"
                name="address"
                value={values.address}
                onChange={handleInputChange('address')}
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rows={3}
                maxRows={6}
                disabled={isLoading}
              />
            </FormControl>
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

InsertDoctorPage.isRequireAuth = true;
export default InsertDoctorPage;