import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

export const menuList = [
  {
    text: 'Karyawan',
    icon: ContactEmergencyIcon,
    path: '/dashboard/employee'
  },
  {
    text: 'Kantor',
    icon: MedicationLiquidIcon,
    path: '/dashboard/office'
  },
  {
    text: 'Absensi',
    icon: AccessibilityNewIcon,
    path: '/dashboard/presence'
  },
];