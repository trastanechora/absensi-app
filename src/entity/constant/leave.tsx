import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import { IconButton, Box, Tooltip, Container, Button } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';

import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccountIcon from '@mui/icons-material/AccountCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PlaceIcon from '@mui/icons-material/Place';

import { convertDateToLocaleString } from '@/app/lib/date';

export const initialFilterState = {
  employee: '',
  employeeType: 'user',
  dateStart: null,
  dateStartType: 'start',
  dateEnd: null,
  dateEndType: 'end',
  status: '',
  statusType: 'status'
};

export const statusList = [
  {
    text: 'Pending',
    value: 'pending'
  },
  {
    text: 'Disetujui',
    value: 'approved'
  }
];

export const TABLE_HEADER = (callbackFunction: (type: string, dataRow: any) => void) => [
  {
    field: "name", headerName: "Nama Karyawan", width: 300, sortable: false,
    renderCell: (params: any) => (
      <Button variant="text" startIcon={<AccountIcon />}>
        {params.row.user.name}
      </Button>
    )
  },
  {
    field: "dayCount", headerName: "Durasi (dalam hari)", width: 300, sortable: false,
    renderCell: (params: any) => (`${params.row.dayCount} Hari`)
  },
  {
    field: "duration", headerName: "Durasi (dalam tanggal)", width: 300, sortable: false,
    renderCell: (params: any) => convertDateToLocaleString(new Date(params.row.dateStart)) + ' - ' + convertDateToLocaleString(new Date(params.row.dateEnd))
  },
  {
    field: "date", headerName: "Tanggal Pengajuan", width: 300, sortable: false,
    renderCell: (params: any) => convertDateToLocaleString(new Date(params.row.createdAt))
  },
  {
    field: "status", headerName: "Status", width: 300, sortable: false,
    renderCell: (params: any) => params.row.status || '-',
  },
  {
    field: 'action',
    headerName: 'Tindakan',
    sortable: false,
    width: 370,
    renderCell: (params: any) =>
      <ButtonGroup variant="outlined" aria-label="text button group">
        <Button onClick={() => callbackFunction('view', params)} sx={{ textTransform: 'none' }} startIcon={<VisibilityIcon />}>Detail</Button>
        <Button disabled onClick={() => callbackFunction('delete', params)} sx={{ textTransform: 'none' }} startIcon={<DeleteForeverIcon />}>Hapus</Button>
      </ButtonGroup>
  }
];

export const FILTER_OBJECT = [
  { text: "Nama Lokasi", value: "f_name"},
];