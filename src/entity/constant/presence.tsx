import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccountIcon from '@mui/icons-material/AccountCircle';
import PlaceIcon from '@mui/icons-material/Place';

import { convertDateToLocaleString } from '@/app/lib/date';
import { convertDateToTime } from '@/app/lib/time';

export const initialFilterState = {
  searchString: '',
  searchType: '',
  status: '',
  statusType: 'f_status',
  office: '',
  officeType: 'f_office'
};

export const statusList = [
  {
    text: 'Aktif',
    value: 'active'
  },
  {
    text: 'Tidak Aktif',
    value: 'inactive'
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
    field: "office", headerName: "Nama Lokasi", width: 300, sortable: false,
    renderCell: (params: any) => (
      <Button variant="text" startIcon={<PlaceIcon />}>
        {params.row.office.name}
      </Button>
    )
  },
  {
    field: "date", headerName: "Tanggal", width: 300, sortable: false,
    renderCell: (params: any) => convertDateToLocaleString(new Date(params.row.createdAt))
  },
  {
    field: "clock_in", headerName: "Clock In", width: 250, sortable: false,
    renderCell: (params: any) => `${convertDateToTime(new Date(params.row.clockInDate))} | ${params.row.clockInDistance}m`
  },
  {
    field: "clock_out", headerName: "Clock Out", width: 250, sortable: false,
    renderCell: (params: any) => `${convertDateToTime(new Date(params.row.clockOutDate))} | ${params.row.clockOutDistance ? `${params.row.clockOutDistance}m` : '-'}`
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