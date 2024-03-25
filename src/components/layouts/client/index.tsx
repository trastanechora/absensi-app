'use client';

import * as React from 'react';
import { useState, type FC, type PropsWithChildren } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';

const getAppBarTitle = (path: string) => {
  switch (path) {
    case '/app/history':
      return 'Riwayat Absensi';
    case '/app/profile':
      return 'Profil Saya'
    default:
      return 'Aplikasi Absensi'
  }
}

const ClientAppLayout: FC<PropsWithChildren> = ({ children }) => {
	const currentPath = usePathname();
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <Box sx={{ pb: 7 }} style={{ maxWidth: 430, margin: 'auto' }} ref={ref}>
      {currentPath !== '/app' ? (
        <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => router.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getAppBarTitle(currentPath)}
          </Typography>
        </Toolbar>
      </AppBar>
      ) : null}
      {children}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3} style={{ maxWidth:430, margin: 'auto' }}>
        <BottomNavigation
          showLabels
          value={currentPath}
          onChange={(event, newValue) => {
            router.push(newValue);
          }}
        >
          <BottomNavigationAction value="/app" label="Absensi" icon={<HomeIcon />} />
          <BottomNavigationAction value="/app/history" label="Riwayat" icon={<RestoreIcon />} />
          <BottomNavigationAction value="/app/profile" label="Profil" icon={<AccountIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default ClientAppLayout;