import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NotificationProvider } from '@/context/notification';
import { ProfileProvider } from '@/context/profile';
import theme from '../theme';

const inter = Inter({ subsets: ["latin"] });

const SEO = {
  title: 'WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi',
  description: 'Aplikasi resmi perusahaan untuk pendataan absensi karyawan',
  url: 'https://atrp2-patimban.com'
}

export const viewport: Viewport = {
  themeColor: '#000079',
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  applicationName: SEO.title,
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
  twitter: {
    card: 'summary',
    title: SEO.title,
    description: SEO.description,
    images: `${SEO.url}/icons/icon_192.png`
  },
  appleWebApp: {
    capable: true,
    title: SEO.title,
    statusBarStyle: 'default',
  },
  openGraph: {
  type: 'website',
  url: SEO.url,
  title: SEO.title,
  description: SEO.description,
  siteName: SEO.title,
  images: [{
    url: `${SEO.url}/icons/icon_192.png`,
  }],
},
  icons: {
    icon: [
      {
        sizes: '192x192',
        url: '/icons/icon_192.png'
      },
      {
        sizes: '384x384',
        url: '/icons/icon_384.png'
      },
      {
        sizes: '512x512',
        url: '/icons/icon_512.png'
      },
    ],
    apple: [
      {
        sizes: '152x152',
        url: '/icons/icon_152.png'
      },
      {
        sizes: '167x167',
        url: '/icons/icon_167.png'
      },
      {
        sizes: '180x180',
        url: '/icons/icon_180.png'
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <ProfileProvider>
          <AppRouterCacheProvider>
            <NotificationProvider>
              <ThemeProvider theme={theme}>
                {children}
              </ThemeProvider>
            </NotificationProvider>
          </AppRouterCacheProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
