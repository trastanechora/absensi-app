'use client'

import Head from 'next/head';
import { Container, Box, Button, Divider, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, TextField } from '@mui/material';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';
import { signOut } from "next-auth/react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/navigation";

import { useNotificationContext } from '@/context/notification';
import { useProfileContext } from '@/context/profile';

const AppProfilePage = () => {
  const [_, dispatch] = useNotificationContext();
  const [myProfile] = useProfileContext();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const oldPassword = e.currentTarget.oldPassword.value;
    const newPassword = e.currentTarget.newPassword.value;
    const confirmPassword = e.currentTarget.confirmPassword.value;
    if (newPassword !== confirmPassword) {
      dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Password baru dan pengulangan password tidak cocok`, severity: 'error' } });
      return;
    }
    
    fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: oldPassword,
          newPassword,
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Ganti password berhasil`, severity: 'success' } });
          setTimeout(() => {
            router.push("/app");
          }, 2000);
        } else {
          const { error } = await res.json();
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal ganti password, Error: ${error}`, severity: 'error' } });
        }
      });
  };

  return (
    <div>
      <Head>
        <title>Profil | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container disableGutters sx={{ width: '100%', px: '20px', my: '20px' }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Informasi
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
                  Nama Karyawan:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {myProfile.name}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
                  Lokasi Clock in/out:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {myProfile.office?.name}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <Typography sx={{ paddingBottom: 0 }} variant="caption" display="block" color="primary" gutterBottom>
                  Diperbolehkan Clock in/out di luar area:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {myProfile.isStrict ? 'Tidak' : 'Ya'}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Ubah Password
            </AccordionSummary>
            <AccordionDetails>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password-old"
                  label="Kata Sandi Lama"
                  name="oldPassword"
                  type="password"
                />
                <Divider sx={{ my: 2 }} />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="Kata Sandi Baru"
                  type="password"
                  id="password-new"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Kata Sandi Baru (Ulangi)"
                  type="password"
                  id="password-confirm"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Simpan
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Divider sx={{ my: 6 }} />
          <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
            <Box sx={{ width: '100%', paddingRight: 1, textAlign: 'center' }}>
              <Button variant="contained" endIcon={<LogoutIcon />} fullWidth onClick={handleLogout}>
                Keluar
              </Button>
            </Box>
          </Container>
        </Container>
      </main>
    </div>
  )
}

export default AppProfilePage;