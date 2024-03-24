'use client';
// import Image from "next/image";
// import Link from "next/link";

// export default function Login() {
//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
//       <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
//         <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
//           <Link href="/">
//             <Image
//               src="/logo.png"
//               priority
//               alt="Logo"
//               className="h-10 w-10 rounded-full"
//               width={20}
//               height={20}
//             />
//           </Link>
//           <h3 className="text-xl font-semibold">Sign In</h3>
//           <p className="text-sm text-gray-500">
//             Use your email and password to sign in
//           </p>
//         </div>
//         <Form type="login" />
//       </div>
//     </div>
//   );
// }

import * as React from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Form from "@/components/form";

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
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
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
            <Image src="/logo.png" alt="Company logo" width={256} height={144} />
            <Form type="login" />
          </Box>
        </Grid>
      </Grid>
  );
}

export default LoginPage