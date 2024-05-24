'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import { DataGrid } from '@mui/x-data-grid';
import {
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNotificationContext } from '@/context/notification';

import styles from '@/styles/Dashboard.module.css'
import { TABLE_HEADER, initialFilterState, statusList } from '@/entity/constant/leave';

import { convertDateToExcelShortString } from '@/app/lib/date';

const PresencePage = () => {
  const [_, dispatch] = useNotificationContext();
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [employeeOptions, setEmployeeOptions] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowPerPage, setRowPerPage] = useState<number>(10);
  const [values, setValues] = useState(initialFilterState);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const downloadCSV = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Nama,Durasi (dalam hari),Tanggal Mulai, Tanggal Selesai,Tanggal Pengajuan,Status\n" +
      data.map(row =>
        `"${row.user.name}","${row.dayCount}","${convertDateToExcelShortString(new Date(row.dateStart))}","${convertDateToExcelShortString(new Date(row.dateEnd))}","${convertDateToExcelShortString(new Date(row.createdAt))}","${row.status}"`
      ).join("\n");

    console.warn('[DEBUG] csvContent', csvContent);
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "list_cuti.csv");
    document.body.appendChild(link);
    link.click();
  }, [data]);

  useEffect(() => {
		if (!search) {
			setEmployeeOptions([]);
			return;
    };

		const delayDebounceFn = setTimeout(async () => {
      fetch(`/api/user/list?name=${search}&page=1&limit=100`)
        .then((res) => res.json())
        .then((resObject) => {
          setEmployeeOptions(resObject)
        })
		}, 1000);

		return () => clearTimeout(delayDebounceFn);
  }, [search, setEmployeeOptions])

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leave?page=${page}&limit=${rowPerPage}`)
      .then((res) => res.json())
      .then((resObject) => {
        setData(resObject.data);
        setCount(resObject.total);
        setLoading(false);
      })
  }, [page, rowPerPage])

  const handleChange = (expandString: string) => {
    if (expanded) {
      setExpanded('');
    } else {
      setExpanded(expandString);
    }
  }

  const handleFilterChange = (prop: string) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleResetFilter = () => {
    setValues(initialFilterState)
  }

  const handleApplyFilter = () => {
    console.warn('[debug] values', values);
    setLoading(true)
    const filterArray = [];
    if (values.employee && values.employee !== null) {
      filterArray.push(`${values.employeeType}=${values.employee}`);
    }

    if (values.dateStart && values.dateStart !== null) {
      filterArray.push(`${values.dateStartType}=${values.dateStart}`);
    }

    if (values.dateEnd && values.dateEnd !== null) {
      filterArray.push(`${values.dateEndType}=${values.dateEnd}`);
    }

    if (values.status && values.status !== null) {
      filterArray.push(`${values.statusType}=${values.status}`);
    }

    const joinedFilter = filterArray.join('&');

    fetch(`/api/leave?page=${page}&limit=${rowPerPage}&${joinedFilter}`)
      .then((res) => res.json())
      .then((resObject) => {
        setData(resObject.data);
        setCount(resObject.total);
        setLoading(false);
      })
  }

  const handleTriggerAction = (type: string, rowData: any) => {
    if (type === 'view') {
      router.push(`/dashboard/leave/${rowData.row.id}`);
    } else {
      setSelectedRow(rowData);
      setDeleteDialogOpen(true);
    }
  }

  const handleOnDelete = useCallback(() => {
    if (selectedRow !== null) {
      // @ts-ignore
      fetch(`/api/leave/${selectedRow.id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then(() => {
          setDeleteDialogOpen(false);
          // @ts-ignore
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menghapus lokasi dengan nama ${selectedRow?.row?.name}`, severity: 'success' } });
          setSelectedRow(null);

          setLoading(true);
          fetch(`/api/leave?page=${page}&limit=${rowPerPage}`)
            .then((res) => res.json())
            .then((resObject) => {
              setData(resObject.data);
              setCount(resObject.total);
              setLoading(false);
            })
        })
    }
  }, [selectedRow, dispatch, page, rowPerPage]);

  return (
    <div className={styles.container}>
      <Head>
        <title>List Cuti | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '70%', paddingRight: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
              List Cuti
            </Typography>
          </Box>
          <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignSelf: 'center' }}>
            <Button variant="contained" onClick={() => downloadCSV()} disabled={isLoading} sx={{ textTransform: 'none' }} endIcon={<PrintIcon />}>Cetak</Button>
          </Box>
        </Container>
        <div className={styles.filterContainer}>
          <Accordion expanded={expanded === 'filter'} onChange={() => handleChange('filter')} disabled={isLoading}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Filter
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                <Box sx={{ width: '50%', paddingRight: 1 }}>
                  <FormControl fullWidth>
                     <Autocomplete
                        disablePortal
                        id="employee"
                        options={employeeOptions}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: '100%' }}
                        noOptionsText="Tidak ada karyawan"
                        onChange={(_, newInputValue) => {
                          if (!newInputValue) return;
                          handleFilterChange('employee')({ target: { value: newInputValue.id } })
                        }}
                        renderInput={(params) => <TextField {...params} label="Karyawan" onChange={e => setSearch(e.target.value)} />}
                      />
                  </FormControl>
                </Box>
                <Box sx={{ width: '50%', paddingLeft: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      label="Status"
                      value={values.status}
                      onChange={handleFilterChange('status')}
                      fullWidth
                    >
                      {statusList.map((option, index) => (<MenuItem key={index} value={option.value}>{option.text}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <Box sx={{ width: '100%', paddingRight: 1 }}>
                    <FormControl fullWidth>
                      <DatePicker
                        label={'Tanggal Awal Pengajuan'}
                        value={values.dateStart}
                        maxDate={dayjs(values.dateEnd)}
                        onChange={value => handleFilterChange('dateStart')({ target: { value: value?.format('YYYY-MM-DD') || null } })}
                        format="LL"
                        slotProps={{
                          textField: {
                            placeholder: '',
                            style: { width: '100%' }
                          },
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '100%', paddingLeft: 1 }}>
                    <FormControl fullWidth>
                      <DatePicker
                        label={'Tanggal Akhir Pengajuan'}
                        minDate={dayjs(values.dateStart)}
                        onChange={value => handleFilterChange('dateEnd')({ target: { value: value?.format('YYYY-MM-DD') || null } })}
                        format="LL"
                        slotProps={{
                          textField: {
                            helperText: '',
                            style: { width: '100%' }
                          },
                        }}
                        />
                    </FormControl>
                  </Box>
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                <Button variant="outlined" onClick={handleResetFilter} disabled={isLoading} sx={{ width: '30%', textTransform: 'none', marginRight: 1 }}>Reset Filter</Button>
                <Button variant="contained" onClick={handleApplyFilter} disabled={isLoading} sx={{ width: '70%', textTransform: 'none', marginLeft: 1 }}>Terapkan Filter</Button>
              </Container>
            </AccordionDetails>
          </Accordion>
        </div>
        <Box style={{ height: 700, width: '100%' }}>
          <DataGrid
            rows={data}
            rowCount={count}
            columns={TABLE_HEADER(handleTriggerAction)}
            disableSelectionOnClick
            disableColumnMenu
            loading={isLoading}
            pagination
            page={page}
            pageSize={rowPerPage}
            paginationMode="server"
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={setPage}
            onPageSizeChange={setRowPerPage}
          />
        </Box>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Apakah Anda yakin?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {/* @ts-ignore */}
              Data akan hilang dan tidak dapat dikembalikan setelah dihapus. Cuti dari <i style={{ fontWeight: 800 }}>{selectedRow?.row?.user.name}</i> akan dihapus?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Tidak</Button>
            <Button onClick={handleOnDelete} autoFocus>
              Ya
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  )
}

export default PresencePage;