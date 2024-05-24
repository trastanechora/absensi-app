'use client'

import { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Container, Box, Chip, Button, Typography, Divider, Skeleton, Card, CardContent, IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AlarmIcon from '@mui/icons-material/Alarm';
import CheckedIcon from '@mui/icons-material/CheckCircleOutline';

import { useNotificationContext } from '@/context/notification';
import Clock from '@/components/clock';
import DialogCamera from '@/components/dialog-camera';
import DialogPermission from '@/components/dialog-permission';
import { useProfileContext } from '@/context/profile';

import { convertDateToTime } from '@/app/lib/time';
import { convertDateToLocaleString } from '@/app/lib/date';

const CustomMap = dynamic(() => import('@/components/map'), { ssr: false, loading: () => <Skeleton variant="rectangular" width="100%" height={300} /> })

const AppHomePage = () => {
  console.warn('[DEBUG] Rendering AppHomePage');
  const [isOpenDialogPermission, setIsOpenDialogPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitType, setSubmitType] = useState('');
  const [_, dispatch] = useNotificationContext();
  const [myProfile] = useProfileContext();
  const mapPayloadRef = useRef({ coords: [0, 0], distance: 0 });

  const getMapPayload = useCallback((coords: number[], distance: number) => {
    mapPayloadRef.current.coords = coords;
    mapPayloadRef.current.distance = distance;
  }, []);

  const handleDialogCameraOpen = useCallback((type: string) => {
    if (myProfile.officeId === null) {
      dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Data lokasi Anda tidak tersedia, mohon untuk melapor ke admin`, severity: 'error' } });
      return;
    }
    if (myProfile.isStrictRadius) {
      if (myProfile.office.radius < mapPayloadRef.current.distance) {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Tidak dapat Clock In, pastikan Anda berada dalam radius lokasi`, severity: 'error' } });
        return;
      }
    }

    // TODO: add validation on duration
    if (myProfile.isStrictDuration) {
      if (myProfile.office.radius < mapPayloadRef.current.distance) {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Tidak dapat Clock In, pastikan durasi memenuhi batas minimal`, severity: 'error' } });
        return;
      }
    }

    setSubmitType(type);
  }, [myProfile, dispatch]);

  const handleDialogCameraClose = () => {
    setSubmitType('');
  };
  
  const doClockIn = useCallback((photo: string) => {
    try {
      fetch(photo)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "photo", { type: "image/png" });

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("userId", myProfile.id);
          formdata.append("officeId", myProfile.officeId);
          formdata.append("clockInLat", String(mapPayloadRef.current.coords[0]));
          formdata.append("clockInLong", String(mapPayloadRef.current.coords[1]));
          formdata.append("clockInDistance", String(mapPayloadRef.current.distance));

          var requestOptions = { method: 'POST', body: formdata };
          
          fetch('/api/presence/clock-in', requestOptions)
            .then((res) => res.json())
            .then((_) => {
                dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil Clock In`, severity: 'success' } })
                setIsLoading(false);
                window.location.reload();
              }).catch((err) => {
                dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal Clock In, error: ${err}`, severity: 'error' } })
                setIsLoading(false);
              })
        })
    } catch (error) {
      dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal Clock In, error: ${error}`, severity: 'error' } })
      setIsLoading(false);
    }
  }, [myProfile, dispatch]);

  const doClockOut = useCallback((photo: string) => {
    try {
      fetch(photo)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "photo", { type: "image/png" });

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("userId", myProfile.id);
          formdata.append("presenceId", myProfile.presences[0].id);
          formdata.append("clockOutLat", String(mapPayloadRef.current.coords[0]));
          formdata.append("clockOutLong", String(mapPayloadRef.current.coords[1]));
          formdata.append("clockOutDistance", String(mapPayloadRef.current.distance));

          var requestOptions = { method: 'POST', body: formdata };
          
          fetch('/api/presence/clock-out', requestOptions)
            .then((res) => res.json())
            .then((_) => {
              myProfile.refetch();
              dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil Clock Out`, severity: 'success' } })
              setIsLoading(false);
            }).catch((err) => {
              dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal Clock Out, error: ${err}`, severity: 'error' } })
              setIsLoading(false);
            })
        })
    } catch (error) {

    }
  }, [myProfile, dispatch])
  
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then(permissions => {
      if (permissions.state !== 'granted') {
        setIsOpenDialogPermission(true);
      }
    });

    setIsLoading(false);
  }, []);

  return (
    <div>
      <Head>
        <title>Beranda | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CustomMap setCurrentPayload={getMapPayload} officeCoordinates={[Number(myProfile?.office?.lat || ''), Number(myProfile?.office?.long || '')]} radius={myProfile?.office?.radius || 0} />
        
        <Container sx={{ width: '100%', px: '20px', my: '20px' }}>
          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            {!isLoading ? (
              <Typography variant="h6" gutterBottom>
                Selamat datang, {myProfile.name}!
              </Typography>
            ) : <Skeleton variant="rectangular" width="100%" height={28} />}
          </Container>
          <Divider sx={{ marginBottom: 1 }} />
          <Container disableGutters sx={{ width: '100%', display: 'inline-flex' }}>
            <Box sx={{ width: '60%', paddingRight: 1 }}>
              {/* First column */}
              <Card sx={{ width: '100%' }} elevation={0}>
                <CardContent sx={{ px: 0 }}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {!isLoading ? convertDateToLocaleString(new Date()) : (<Skeleton variant="rectangular" width="100%" height={33.59} />)}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {!isLoading ? (
                      <Clock />
                    ) : <Skeleton variant="rectangular" width="100%" height={72.81} />}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ width: '40%', paddingLeft: 1, textAlign: 'center', margin: 'auto' }}>
              {/* Second column */}
              <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  {(!myProfile.presences[0]?.clockInDate && !myProfile.presences[0]?.clockOutDate) && (
                    <Button disabled={isLoading} variant="contained" size="large" endIcon={<AlarmIcon />} fullWidth  sx={{ height: '100px' }} onClick={() => handleDialogCameraOpen('in')}>
                      Clock In
                    </Button>
                  )}
                  {(myProfile.presences[0]?.clockInDate && !myProfile.presences[0]?.clockOutDate) && (
                    <Button disabled={isLoading} variant="contained" size="large" endIcon={<AlarmIcon />} fullWidth sx={{ height: '100px' }} onClick={() => handleDialogCameraOpen('out')}>
                      Clock Out
                    </Button>
                  )}
                  {(myProfile.presences[0]?.clockInDate && myProfile.presences[0]?.clockOutDate) && (
                    <IconButton disabled={isLoading} color="success" size="large" sx={{ height: '100px' }}><CheckedIcon fontSize="large" /></IconButton>
                  )}
                </Box>
              </Container>
            </Box>
          </Container>
          <Divider sx={{ marginBottom: 3 }} />
          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            {!isLoading ? (
              <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
                <Box sx={{ width: '50%', paddingRight: 1, textAlign: 'center' }}>
                  <Button startIcon={<LoginIcon />} fullWidth>Clock In</Button>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={myProfile.presences.length === 0 ? '-' : convertDateToTime(new Date(myProfile.presences[0].clockInDate))}
                  />
                </Box>
                <Box sx={{ width: '50%', paddingLeft: 1, textAlign: 'center' }}>
                  <Button startIcon={<LogoutIcon />} fullWidth>Clock Out</Button>
                  <Chip
                    icon={<ScheduleIcon />}
                    label={myProfile.presences.length > 0 && myProfile.presences[0]?.clockOutDate !== null ? convertDateToTime(new Date(myProfile.presences[0].clockOutDate)) : '-' } />
                </Box>
              </Container>
            ) : (
              <Skeleton variant="rectangular" width="100%" height={68.5} />
            )}
          </Container>
        </Container>

        <DialogCamera isOpen={Boolean(submitType)} handleClickClose={handleDialogCameraClose} type={submitType} handleSubmit={submitType === 'in' ? doClockIn : doClockOut} />
        <DialogPermission isOpen={isOpenDialogPermission} handleClickClose={() => setIsOpenDialogPermission(false)} />
      </main>
    </div>
  )
}

export default AppHomePage;