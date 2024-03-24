'use client';

import { FC, PropsWithChildren, useCallback, useState, MouseEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import Image from "next/image";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

import { drawerWidth, openedMixin, closedMixin, DrawerHeader } from './style'
import { menuList } from './constant'
import styles from '@/styles/Dashboard.module.css'
import { Container } from '@mui/material';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Dashboard: FC<PropsWithChildren<{ displayName: string }>> = ({ children, displayName }) => {
	const router = useRouter();
	const currentPath = usePathname();
//   const { user } = useAuthState()

  // Drawer controller
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
	const isSelected = useCallback((link: string) => {
    return currentPath === link;
  }, [currentPath])
  // ============

  // Account menu controller
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  // ============

  const redirectTo = useCallback((link: string) => {
    if (currentPath === link) {
      return;
    }
    router.push(link);
  }, [currentPath, router])

  const handleLogout = () => {
    signOut();
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!open ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose}
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{
                marginRight: 5,
              }}>
              <ChevronLeftIcon />
            </IconButton>)}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi
          </Typography>
          <Box sx={{ flexGrow: 0, display: 'flex' }}>
            <Typography variant="caption" sx={{ alignSelf: 'center', mr: 2 }}>{displayName}</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
								<Avatar alt={displayName}>{displayName.slice(0, 2)}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={openMenu}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader></DrawerHeader>
        <Divider />
				<List>
					<ListItem disablePadding sx={{ display: 'block', textAlign: 'center', height: 76 }}>
						{open ?
							<Image
								src="/logo.png"
								priority
								alt="Logo"
								className="h-10 w-10 rounded-full"
								width={128}
								height={72}
							/> : <Image
								src="/logo-vertical.png"
								priority
								alt="Logo"
								className="h-10 w-10 rounded-full"
								width={36}
								height={64}
							/>
						}
					</ListItem>
					<Divider />
          {menuList.map((menuItem) => (
            <ListItem key={menuItem.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => redirectTo(menuItem.path)}
								selected={isSelected(menuItem.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {<menuItem.icon />}
                </ListItemIcon>
                <ListItemText primary={menuItem.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth={false} disableGutters sx={{ width: '100%', minHeight: 1000 }}>
          {children}
        </Container>
        <footer className={styles.footer}>
          Made with ❤️ by
          <a
            href="https://www.linkedin.com/in/trastanechora/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mae
          </a>
        </footer>
      </Box>
    </Box>
  );
}

export default Dashboard;