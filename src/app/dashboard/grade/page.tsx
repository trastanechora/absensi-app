'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import {
  Accordion,
  Button,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import styles from '@/styles/Dashboard.module.css'
import { TABLE_HEADER, initialFilterState } from '@/entity/constant/grade';
import { useNotificationContext } from '@/context/notification';

const GradePage = () => {
  const [_, dispatch] = useNotificationContext();
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowPerPage, setRowPerPage] = useState<number>(10);
  const [values, setValues] = useState(initialFilterState);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const router = useRouter()

  useEffect(() => {
    if (page === 0) return;
    setLoading(true)
    fetch(`/api/grade?page=${page}&limit=${rowPerPage}`)
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
    setLoading(true)
    const filterArray = [];
    if (values.name && values.nameType) {
      filterArray.push(`${values.nameType}=${values.name}`);
    }
    const joinedFilter = filterArray.join('&');

    fetch(`/api/grade?page=${page}&limit=${rowPerPage}&${joinedFilter}`)
      .then((res) => res.json())
      .then((resObject) => {
        setData(resObject.data);
        setCount(resObject.total);
        setLoading(false);
      })
  }

  const handleTriggerAction = (type: string, rowData: any) => {
    if (type === 'view') {
      router.push(`/dashboard/grade/${rowData.row.id}`);
    } else if (type === 'edit') {
      router.push(`/dashboard/grade/${rowData.row.id}/edit`);
    } else {
      setSelectedRow(rowData);
      setDeleteDialogOpen(true);
    }
  }

  const handleOnDelete = useCallback(() => {
    if (selectedRow !== null) {
      // @ts-ignore
      fetch(`/api/grade/${selectedRow.id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then(() => {
          setDeleteDialogOpen(false);
          // @ts-ignore
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menghapus jabatan dengan nama ${selectedRow?.row?.name}`, severity: 'success' } });
          setSelectedRow(null);

          setLoading(true);
          fetch(`/api/grade?page=${page}&limit=${rowPerPage}`)
            .then((res) => res.json())
            .then((resObject) => {
              setData(resObject.data);
              setCount(resObject.total);
              setLoading(false);
            })
        })
    }
  }, [selectedRow, page, rowPerPage, dispatch]);

  return (
    <div className={styles.container}>
      <Head>
        <title>List Jabatan | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
          <Box sx={{ width: '70%', paddingRight: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600, marginBottom: 3 }}>
              List Jabatan
            </Typography>
          </Box>
          <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignSelf: 'center' }}>
            <Button variant="contained" onClick={() => router.push('/dashboard/grade/add')} disabled={isLoading} sx={{ textTransform: 'none' }}>Tambahkan Jabatan</Button>
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
              <Container maxWidth={false} disableGutters sx={{ width: '100%', marginTop: 2 }}>
                <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginBottom: 1 }}>
                  <Box sx={{ width: '100%' }}>
                    <FormControl fullWidth>
                      <TextField fullWidth id="search-keyword" label="Nama Jabatan" variant="outlined" value={values.name} onChange={handleFilterChange('name')} />
                    </FormControl>
                  </Box>
                </Container>
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
            rowsPerPageOptions={[10, 20, 50]}
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
              Data akan hilang dan tidak dapat dikembalikan setelah dihapus. Jabatan dengan nama <i style={{ fontWeight: 800 }}>{selectedRow?.row?.name}</i> akan dihapus?
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

export default GradePage;