import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PlaceIcon from '@mui/icons-material/Place';
import AccountIcon from '@mui/icons-material/AccountCircle';
import HubIcon from '@mui/icons-material/Hub';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LeaveIcon from '@mui/icons-material/Logout';

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
  {
    text: 'Cuti',
    icon: LeaveIcon,
    path: '/dashboard/leave'
  },
  {
    text: 'Departemen',
    icon: HubIcon,
    path: '/dashboard/division'
  },
  {
    text: 'Jabatan',
    icon: AccountTreeIcon,
    path: '/dashboard/grade'
  },
];