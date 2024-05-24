'use client';

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Typography, Box, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { convertDateToLocaleString } from '@/app/lib/date';
import { convertDateToTime } from '@/app/lib/time';
import styles from '@/styles/Dashboard.module.css'

const PresenceDetailPage = ({ params }: { params: { id: string } }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/leave/${id}`)
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
        <title>Detail Cuti | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Button variant="outlined" onClick={() => router.back()} startIcon={<ChevronLeftIcon />} sx={{ marginRight: 3, textTransform: 'none' }}>Kembali</Button>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
            Detail Cuti
          </Typography>
        </Box>

        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
            <b>Tanggal Cuti:</b>
          </Box>
          <Box sx={{ width: '100%' }}>
            {detail.dateStart === detail.dateEnd && convertDateToLocaleString(new Date(detail.dateStart))}
            {detail.dateStart !== detail.dateEnd && `${convertDateToLocaleString(new Date(detail.dateStart))} - ${convertDateToLocaleString(new Date(detail.dateEnd))}`}
          </Box>
        </Container>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
            <b>Hari Terhitung:</b>
          </Box>
          <Box sx={{ width: '100%' }}>
            {detail.dayCount}
          </Box>
        </Container>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
            <b>Status:</b>
          </Box>
          <Box sx={{ width: '100%' }}>
            {detail.status}
          </Box>
        </Container>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
            <b>Persetujuan:</b>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={-1} orientation="vertical">
              {detail.approvals?.map(approval => {
                const copyApproved = approval.type === 'acknoledge' ? 'Telah mengetahui' : 'Telah menyetujui';
                const copyWaiting = approval.type === 'acknoledge' ? 'Pemberitahuan terkirim' : 'Menunggu persetujuan';
                return (
                  <Step key={approval.id}>
                    <StepLabel
                      optional={
                        approval.status === 'approved'
                          ? <Typography sx={{ color: 'green' }} variant="caption">{copyApproved}</Typography>
                          : <Typography sx={{ color: 'orange' }} variant="caption">{copyWaiting}</Typography>}
                    >
                      {approval.user.name} {approval.type === 'acknoledge' ? '(Opsional)' : '' }
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </Box>
        </Container>
        <Divider sx={{ marginBottom: 3 }} />
      </main>
    </div>
  )
}

export default PresenceDetailPage;