'use client';

import * as React from 'react';
import type { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';

const ClientAppLayout: FC<PropsWithChildren> = ({ children }) => {
	const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ pb: 7 }} style={{ maxWidth: 430, margin: 'auto' }} ref={ref}>
      {children}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3} style={{ maxWidth:430, margin: 'auto' }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Absensi" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Riwayat" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Profil" icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default ClientAppLayout;