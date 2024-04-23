'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, Accordion, AccordionSummary, AccordionDetails, Typography, Container, Box, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import styles from '@/styles/Dashboard.module.css'
import { TABLE_HEADER, FILTER_OBJECT, initialFilterState } from '@/entity/constant/presence';

import { convertDateToExcelShortString } from '@/app/lib/date';
import { convertDateToTime } from '@/app/lib/time';

const PresencePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);
  const [values, setValues] = useState(initialFilterState);
  const [search, setSearch] = useState('');

  const downloadCSV = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Nama,Lokasi,Tanggal,Durasi,Waktu Clock In,Jarak Clock In,Foto Clock In,Waktu Clock Out,Jarak Clock Out,Foto Clock Out\n" +
      data.map(row =>
        `"${row.user.name}","${row.office.name}","${convertDateToExcelShortString(new Date(row.createdAt))}","${row.duration}","${`${convertDateToTime(new Date(row.clockInDate))}`}","${row.clockInDistance}m",""${row.clockInPhoto}"","${row.clockOutDate ? convertDateToTime(new Date(row.clockOutDate)) : '-'}","${row.clockOutDistance ? row.clockOutDistance : '-'}","${row.clockInPhoto ? row.clockInPhoto : '-'}"`
      ).join("\n");

    console.warn('[DEBUG] csvContent', csvContent);
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "list_absensi.csv");
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
    if (page === 0) return;
    setLoading(true)
    fetch(`/api/presence?page=${page || 1}&limit=${rowPerPage}`)
      .then((res) => res.json())
      .then((resObject) => {
        setData(resObject)
        setLoading(false)
      })
    
    fetch(`/api/office/list`)
      .then((res) => res.json())
      .then((resObject) => {
        setOfficeOptions(resObject)
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

    if (values.office && values.office !== null) {
      filterArray.push(`${values.officeType}=${values.office}`);
    }

    const joinedFilter = filterArray.join('&');

    fetch(`/api/presence?page=${page || 1}&limit=${rowPerPage}&${joinedFilter}`)
      .then((res) => res.json())
      .then((resObject) => {
        setData(resObject);
        setLoading(false);
      })
  }

  const handleTriggerAction = (type: string, rowData: any) => {
    if (type === 'view') {
      router.push(`/dashboard/presence/${rowData.row.id}`);
    } else {
      // TODO: add delete mechanism
      console.warn('delete', rowData);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>List Absensi | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '70%', paddingRight: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
              List Absensi
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
                    <InputLabel id="office-label">Kantor</InputLabel>
                    <Select
                      labelId="office-label"
                      id="office"
                      label="Kantor"
                      value={values.office}
                      onChange={handleFilterChange('office')}
                      fullWidth
                    >
                      {officeOptions.map((option, index) => (<MenuItem key={index} value={option.id}>{option.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <Box sx={{ width: '100%', paddingRight: 1 }}>
                    <FormControl fullWidth>
                      <DatePicker
                        label={'Tanggal Awal'}
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
                        label={'Tanggal Akhir'}
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
            columns={TABLE_HEADER(handleTriggerAction)}
            disableSelectionOnClick
            disableColumnMenu
            loading={isLoading}
            pagination
            page={page}
            pageSize={rowPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={setPage}
            onPageSizeChange={setRowPerPage}
          />
        </Box>
      </main>
    </div>
  )
}

export default PresencePage;