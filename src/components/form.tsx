"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useNotificationContext } from '@/context/notification';
import { useProfileContext } from '@/context/profile';

export default function Form({ type }: { type: "login" | "register" }) {
  const [_, dispatch] = useNotificationContext();
  const [loading, setLoading] = useState(false);
  const [myProfile] = useProfileContext();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (type === "login") {
      signIn("credentials", {
        redirect: false,
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
        // @ts-ignore
      }).then(({ error }) => {
        if (error) {
          setLoading(false);
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal masuk, Error: ${error}`, severity: 'error' } });
        } else {
          // Redirect base on user role
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil masuk, meneruskan ke halaman muka..`, severity: 'success' } });
          if (myProfile.role === 'admin') router.push("/dashboard/employee");

          router.push('/app');
        }
        setLoading(false);
      });
    } else {
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: 'test',
          role: 'test',
          email: e.currentTarget.email.value,
          password: e.currentTarget.password.value,
        }),
      }).then(async (res) => {
        setLoading(false);
        if (res.status === 200) {
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Akun berhasil dibuat, meneruskan ke halaman masuk..`, severity: 'success' } });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          const { error } = await res.json();
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal daftar, Error: ${error}`, severity: 'error' } });
        }
      });
    }
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Alamat Email"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Kata Sandi"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {type === "login" ? 'Masuk' : 'Daftar'}
      </Button>
      <Grid container>
        <Grid item xs>
        </Grid>
        <Grid item>
          <Link href={type === "login" ? '/register' : '/login'} variant="body2">
            {type === "login" ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}