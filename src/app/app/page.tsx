'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Container, Box, Chip, Button, Typography, Divider, Skeleton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AlarmIcon from '@mui/icons-material/Alarm';

import { useNotificationContext } from '@/context/notification';
import Clock from '@/components/clock';
import DialogPermission from '@/components/dialog-permission';
import { useProfileContext } from '@/context/profile';

import { convertDateToTime } from '@/app/lib/time';

const CustomMap = dynamic(() => import('@/components/map'), { ssr: false, loading: () => <Skeleton variant="rectangular" width="100%" height={400} /> })

const AppHomePage = () => {
  const [isOpenDialogPermission, setIsOpenDialogPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [_, dispatch] = useNotificationContext();
  const [myProfile] = useProfileContext();
  const mapPayloadRef = useRef({ coords: [0, 0], distance: 0 });

  const getMapPayload = useCallback((coords: number[], distance: number) => {
    mapPayloadRef.current.coords = coords;
    mapPayloadRef.current.distance = distance;
  }, [])
  
  const doClockIn = useCallback(() => {
    
    if (myProfile.isStrict) {
      if (myProfile.office.radius < mapPayloadRef.current.distance) {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Tidak dapat Clock In, pastikan Anda berada dalam radius lokasi`, severity: 'error' } });
        return;
      }
    }
    
    const body = {
      userId: myProfile.id,
      officeId: myProfile.officeId,
      clockInLat: String(mapPayloadRef.current.coords[0]),
      clockInLong: String(mapPayloadRef.current.coords[1]),
      clockInDistance: mapPayloadRef.current.distance,
      clockInDate: new Date(),
    };
    
    setIsLoading(true)
    fetch('/api/presence/clock-in', { method: 'POST', body: JSON.stringify(body) })
    .then((res) => res.json())
    .then((_) => {
        myProfile.refetch();
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil Clock In`, severity: 'success' } })
        setIsLoading(false);
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal Clock In, error: ${err}`, severity: 'error' } })
        setIsLoading(false);
      })
  }, [myProfile, dispatch]);

  const doClockOut = useCallback(() => {
    if (myProfile.isStrict) {
      if (myProfile.office.radius < mapPayloadRef.current.distance) {
        myProfile.refetch();
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Tidak dapat Clock Out, pastikan Anda berada dalam radius lokasi`, severity: 'error' } });
        return;
      }
    }

    const body = {
      presenceId: myProfile.presences[0].id,
      clockOutLat: String(mapPayloadRef.current.coords[0]),
      clockOutLong: String(mapPayloadRef.current.coords[1]),
      clockOutDistance: mapPayloadRef.current.distance,
      clockOutDate: new Date(),
    };

    setIsLoading(true)
    fetch('/api/presence/clock-out', { method: 'POST', body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((_) => {
        myProfile.refetch();
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil Clock Out`, severity: 'success' } })
        setIsLoading(false);
      }).catch((err) => {
        dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal Clock Out, error: ${err}`, severity: 'error' } })
        setIsLoading(false);
      })
  }, [myProfile, dispatch])
  
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then(permissions => {
      if (permissions.state !== 'granted') {
        setIsOpenDialogPermission(true);
      }
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!myProfile.id) {
      myProfile.refetch();
    }
  }, [myProfile]);

  return (
    <div>
      <Head>
        <title>Beranda | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CustomMap setCurrentPayload={getMapPayload} officeCoordinates={[Number(myProfile?.office?.lat || ''), Number(myProfile?.office?.long || '')]} radius={myProfile?.office?.radius || 0} />

        <Container disableGutters sx={{ width: '100%', px: '20px', my: '20px' }}>
          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            {!isLoading ? (
              <Typography variant="subtitle1" gutterBottom>
                Selamat datang, {myProfile.name}!
              </Typography>
            ) : <Skeleton variant="rectangular" width="100%" height={28} />}
          </Container>

          <Container disableGutters sx={{ width: '100%', display: 'flex', marginTop: 1 }}>
            {!isLoading ? (
              <Typography variant="subtitle1" gutterBottom>
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            ) : <Skeleton variant="rectangular" width="100%" height={33.59} />}
          </Container>

          <Container disableGutters sx={{ width: '100%', display: 'flex', marginTop: 1 }}>
            {!isLoading ? (
              <Clock />
            ) : <Skeleton variant="rectangular" width="100%" height={72.81} />}
          </Container>

          <Divider sx={{ marginBottom: 3 }} />
          
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

          <Divider sx={{ my: 6 }} />

          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            <Box sx={{ width: '100%', paddingRight: 1, textAlign: 'center' }}>
              {(!myProfile.presences[0]?.clockInDate && !myProfile.presences[0]?.clockOutDate) && (
                <Button disabled={isLoading} variant="contained" endIcon={<AlarmIcon />} fullWidth onClick={doClockIn}>
                  Clock In
                </Button>
              )}
              {(myProfile.presences[0]?.clockInDate && !myProfile.presences[0]?.clockOutDate) && (
                <Button disabled={isLoading} variant="contained" endIcon={<AlarmIcon />} fullWidth onClick={doClockOut}>
                  Clock Out
                </Button>
              )}
            </Box>
          </Container>
        </Container>

        <DialogPermission isOpen={isOpenDialogPermission} handleClickClose={() => setIsOpenDialogPermission(false)} />
      </main>
    </div>
  )
}

export default AppHomePage;