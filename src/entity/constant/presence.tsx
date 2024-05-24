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
  office: '',
  officeType: 'office'
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

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

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
      params.row.office ? <Button variant="text" startIcon={<PlaceIcon />}>
        {params.row.office?.name}
      </Button> : <>- Lokasi telah dihapus -</>
    )
  },
  {
    field: "date", headerName: "Tanggal", width: 300, sortable: false,
    renderCell: (params: any) => convertDateToLocaleString(new Date(params.row.createdAt))
  },
  {
    field: "duration", headerName: "Durasi", width: 300, sortable: false,
    renderCell: (params: any) => params.row.duration || '-',
  },
  {
    field: "photo", headerName: "Foto", width: 300, sortable: false,
    renderCell: (params: any) => (
      <NoMaxWidthTooltip
        title={
          <Container maxWidth={false} disableGutters sx={{ display: 'flex', width: '500px' }}>
            <Box sx={{ width: '50%' }}>
              Clock In:
              <img src={params.row.clockInPhoto} alt="Clock in photo" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
            <Box sx={{ width: '50%' }}>
              Clock Out:
              {params.row.clockOutPhoto && <img src={params.row.clockOutPhoto} alt="Clock out photo" style={{ maxWidth: '100%', height: 'auto' }} />}
            </Box>
          </Container>
        }
      >
        <IconButton>
          <PhotoLibraryIcon />
        </IconButton>
      </NoMaxWidthTooltip>
    )
  },
  // {
  //   field: "clock_in", headerName: "Clock In", width: 250, sortable: false,
  //   renderCell: (params: any) => `${convertDateToTime(new Date(params.row.clockInDate))} | ${params.row.clockInDistance}m`
  // },
  // {
  //   field: "clock_out", headerName: "Clock Out", width: 250, sortable: false,
  //   renderCell: (params: any) => `${convertDateToTime(new Date(params.row.clockOutDate))} | ${params.row.clockOutDistance ? `${params.row.clockOutDistance}m` : '-'}`
  // },
  {
    field: 'action',
    headerName: 'Tindakan',
    sortable: false,
    width: 370,
    renderCell: (params: any) =>
      <ButtonGroup variant="outlined" aria-label="text button group">
        <Button onClick={() => callbackFunction('view', params)} sx={{ textTransform: 'none' }} startIcon={<VisibilityIcon />}>Detail</Button>
        <Button onClick={() => callbackFunction('delete', params)} sx={{ textTransform: 'none' }} startIcon={<DeleteForeverIcon />}>Hapus</Button>
      </ButtonGroup>
  }
];

export const FILTER_OBJECT = [
  { text: "Nama Lokasi", value: "f_name"},
];