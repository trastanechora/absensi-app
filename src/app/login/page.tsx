'use client';

import * as React from 'react';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Form from "@/components/form";

import logo from '../../../public/logos/company.png';

const LoginPage = () => {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={false}
        md={4}
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.primary.main,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={12} md={8} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image src={logo} alt="Company logo" width={256} height={144} />
          <Form type="login" />
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage