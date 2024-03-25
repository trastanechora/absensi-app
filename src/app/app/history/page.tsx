'use client'

import { useEffect, useState, useRef} from 'react';
import Head from 'next/head';
import { Container, Box, List, Divider, ListItem, Stepper, Typography, Step, StepLabel, Card, CardContent, Alert } from '@mui/material';
import { convertDateToTime } from '@/app/lib/time';
import { convertDateToLocaleString } from '@/app/lib/date';

interface Presence {
  clockInDate: string;
  clockOutDate?: string;
  clockInDistance: number;
  clockOutDistance?: number;
  createdAt: string;
  duration?: string;
  office: {
    name: string;
  }
}

const AppHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef([]);

  useEffect(() => {
    if (listRef.current.length === 0) {
      fetch(`/api/presence/history`)
      .then((res) => res.json())
      .then(responseObject => {
        listRef.current = responseObject;
        setIsLoading(false);
        console.warn('[DEBUG] listRef', listRef);
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Profil | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container disableGutters sx={{ width: '100%', px: '20px', my: '20px' }}>
          <Divider sx={{ my: 6 }} />

          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            <Box sx={{ width: '100%', paddingRight: 1, textAlign: 'center' }}>
              {listRef.current.length === 0 && !isLoading && (<Alert severity="info">Anda belum memiliki riwayat absensi</Alert>)}
              <List>
                {listRef.current.map((presence: Presence, index) => {
                  const clockInTime = convertDateToTime(new Date(presence.clockInDate));
                  const clockInDistance = `${Math.round(presence.clockInDistance)} m`;
                  const clockOutTime = presence.clockOutDate ? convertDateToTime(new Date(presence.clockOutDate)) : '-';
                  const clockOutDistance = presence.clockOutDistance ? `${Math.round(presence.clockOutDistance)} m` : '-';


                  return (
                    <ListItem key={index} component="div" disablePadding>
                      <Card style={{ width: '100%', marginBottom: 4 }} variant="outlined">
                        <CardContent>
                          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
                            <Box sx={{ width: '50%', paddingRight: 1, textAlign: 'center' }}>
                              <Stepper activeStep={presence.clockOutDate ? 2 : 1} orientation="vertical">
                                <Step>
                                  <StepLabel optional={<Typography variant="caption">{clockInTime} | {clockInDistance}</Typography>}>Clock In</StepLabel>
                                </Step>
                                <Step>
                                  <StepLabel error={!presence.clockOutDate} optional={<Typography variant="caption">{clockOutTime} | {clockOutDistance}</Typography>}>Clock Out</StepLabel>
                                </Step>
                              </Stepper>
                            </Box>
                            <Box sx={{ width: '50%', paddingRight: 1, textAlign: 'center', margin: 'auto' }}>
                              <Card variant="outlined">
                                <CardContent>
                                  
                                  <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    {convertDateToLocaleString(new Date(presence.createdAt))}
                                  </Typography>
                                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                    Lokasi: {presence.office.name}
                                  </Typography>
                                  <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                    Durasi: {presence.duration ? presence.duration : '-'}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Box>
                          </Container>
                        </CardContent>
                      </Card>
                    </ListItem>
                  )
                })}
              </List>
            </Box>
          </Container>
        </Container>
      </main>
    </div>
  )
}

export default AppHistoryPage;