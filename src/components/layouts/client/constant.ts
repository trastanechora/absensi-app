import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

export const menuList = [
  {
    text: 'Home',
    icon: ContactEmergencyIcon,
    path: '/app'
  },
  {
    text: 'Riwayat Absensi',
    icon: MedicationLiquidIcon,
    path: '/app/presence-history'
  },
  {
    text: 'Profil',
    icon: AccessibilityNewIcon,
    path: '/app/profile'
  },
];