import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PlaceIcon from '@mui/icons-material/Place';
import AccountIcon from '@mui/icons-material/AccountCircle';

export const menuList = [
  {
    text: 'Karyawan',
    icon: AccountIcon,
    path: '/dashboard/employee'
  },
  {
    text: 'Lokasi',
    icon: PlaceIcon,
    path: '/dashboard/office'
  },
  {
    text: 'Absensi',
    icon: ContactEmergencyIcon,
    path: '/dashboard/presence'
  },
];