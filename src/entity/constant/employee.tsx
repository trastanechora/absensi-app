import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaceIcon from '@mui/icons-material/Place';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const statusList = [
  {
    text: 'Aktif',
    value: 'active'
  },
  {
    text: 'Tidak Aktif',
    value: 'inactive'
  }
]

export const initialFilterState = {
  searchString: '',
  searchType: 'name',
  status: '',
  statusType: 'status',
  office: '',
  officeType: 'office'
}

export const TABLE_HEADER = (callbackFunction: (type: string, dataRow: any) => void) => [
  { field: "name", headerName: "Nama Karyawan", sortable: false, flex: 3 },
  {
    field: "office", headerName: "Lokasi", sortable: false, flex: 2,
    renderCell: (params: any) => {
      if (params.value === null) return '-'
      
      return (
        <Button variant="text" startIcon={<PlaceIcon />}>
          {params.value.name}
        </Button>
      )
    }
  },
  { field: "email", headerName: "Alamat Email", sortable: false, flex: 1 },
  {
    field: "isStrictRadius", headerName: "Clock In/Out Dari Luar Area", sortable: false, flex: 1,
    renderCell: (params: any) => {
      if (params.value) return "Tidak Diperbolehkan"
      return "Diperbolehkan"
    }
  },
  {
    field: "isStrictDuration", headerName: "Clock In/Out Kurang Dari Durasi", sortable: false, flex: 1,
    renderCell: (params: any) => {
      if (params.value) return "Tidak Diperbolehkan"
      return "Diperbolehkan"
    }
  },
  {
    field: "loggedIn", headerName: "Status Kunci Perangkat", sortable: false, flex: 1,
    renderCell: (params: any) => {
      console.warn('[debug] params');
      if (!params.value) return "Belum Terkunci"
      return "Terkunci"
    }
  },
  // { field: "address", headerName: "Alamat", sortable: false },
  {
    field: 'action',
    headerName: 'Tindakan',
    sortable: false,
    flex: 3,
    renderCell: (params: any) =>
      <ButtonGroup variant="outlined" aria-label="text button group">
        <Button onClick={() => callbackFunction('view', params)} sx={{ textTransform: 'none' }} startIcon={<VisibilityIcon />}>Detail</Button>
        <Button onClick={() => callbackFunction('edit', params)} sx={{ textTransform: 'none' }} startIcon={<EditIcon />}>Ubah</Button>
        <Button onClick={() => callbackFunction('delete', params)} sx={{ textTransform: 'none' }} startIcon={<DeleteForeverIcon />}>Hapus</Button>
      </ButtonGroup>
  }
];

export const FILTER_OBJECT = [
  { text: "Nama Karyawan", value: "name"},
  { text: "Email", value: "email"},
];