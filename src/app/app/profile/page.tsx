'use client'

import Head from 'next/head';
import { Container, Box, Button, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';
import { signOut } from "next-auth/react";

import { useProfileContext } from '@/context/profile';

const AppProfilePage = () => {
  const myProfile = useProfileContext();

  const handleLogout = () => {
    signOut();
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