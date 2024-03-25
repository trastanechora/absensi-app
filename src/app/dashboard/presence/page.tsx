'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import { DataGrid } from '@mui/x-data-grid';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container, Box, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

import styles from '@/styles/Dashboard.module.css'
import { TABLE_HEADER, FILTER_OBJECT, statusList, initialFilterState } from '@/entity/constant/presence';

import { convertDateToLocaleString } from '@/app/lib/date';
import { convertDateToTime } from '@/app/lib/time';

const EmployeePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);
  const [values, setValues] = useState(initialFilterState);

  const downloadCSV = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Nama,Lokasi,Tanggal,Clock In,Clock Out\n" +
      data.map(row =>
        `"${row.user.name}","${row.office.name}","${convertDateToLocaleString(new Date(row.createdAt))}","${`${convertDateToTime(new Date(row.clockInDate))} | ${row.clockInDistance}m`}","${`${convertDateToTime(new Date(row.clockOutDate))} | ${row.clockOutDistance ? `${row.clockOutDistance}m` : '-'}`}"`
      ).join("\n");

    console.warn('[DEBUG] csvContent', csvContent);
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "list_absensi.csv");
    document.body.appendChild(link);
    link.click();
  }, [data]);

  const router = useRouter()

  useEffect(() => {
    if (page === 0) return;
    setLoading(true)
    fetch(`/api/presence?page=${page}&limit=${rowPerPage}`)
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
    setLoading(true)
    const filterArray = [];
    if (values.searchString && values.searchType) {
      filterArray.push(`${values.searchType}=${values.searchString}`);
    }
    const joinedFilter = filterArray.join('&');

    fetch(`/api/presence?page=${page}&limit=${rowPerPage}&${joinedFilter}`)
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
              <Typography variant="caption" display="block">
                Isi kolom input &quot;Kata Kunci&quot; apa dan &quot;Berdasarkan Kolom&quot; mana yang ingin Anda tampilkan kemudian tekan &quot;Terapkan Filter&quot;.
              </Typography>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
                <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
                  <Box sx={{ width: '70%', paddingRight: 1 }}>
                    <FormControl fullWidth>
                      <TextField fullWidth id="search-keyword" label="Kata Kunci" variant="outlined" value={values.searchString} onChange={handleFilterChange('searchString')} />
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '30%', paddingLeft: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel id="search-type-label">Berdasarkan Kolom</InputLabel>
                      <Select
                        labelId="search-type-label"
                        id="search-type"
                        label="Berdasarkan Kolom"
                        value={values.searchType}
                        onChange={handleFilterChange('searchType')}
                        fullWidth
                      >
                        {FILTER_OBJECT.map((option, index) => (<MenuItem key={index} value={option.value}>{option.text}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </Box>
                </Container>
              </Container>
              <Typography variant="caption" display="block">
                Atau pilih berdasarkan beberapa kolom yang memiliki nilai pasti berikut:
              </Typography>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                <Box sx={{ width: '50%', paddingRight: 1 }}>
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
                      {officeOptions.map((option, index) => (<MenuItem key={index} value={option.value}>{option.text}</MenuItem>))}
                    </Select>
                  </FormControl>
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

export default EmployeePage;