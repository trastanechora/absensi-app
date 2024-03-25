import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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
  { field: "name", headerName: "Nama Lokasi", width: 300, sortable: false },
  { field: "radius", headerName: "Radius", width: 250, sortable: false },
  { field: "lat", headerName: "Latitude", width: 200, sortable: false },
  { field: "long", headerName: "Longitude", width: 200, sortable: false },
  {
    field: 'action',
    headerName: 'Tindakan',
    sortable: false,
    width: 370,
    renderCell: (params: any) =>
      <ButtonGroup variant="outlined" aria-label="text button group">
        <Button onClick={() => callbackFunction('view', params)} sx={{ textTransform: 'none' }} startIcon={<VisibilityIcon />}>Detail</Button>
        <Button disabled onClick={() => callbackFunction('edit', params)} sx={{ textTransform: 'none' }} startIcon={<EditIcon />}>Ubah</Button>
        <Button disabled onClick={() => callbackFunction('delete', params)} sx={{ textTransform: 'none' }} startIcon={<DeleteForeverIcon />}>Hapus</Button>
      </ButtonGroup>
  }
];

export const FILTER_OBJECT = [
  { text: "Nama Lokasi", value: "f_name"},
];