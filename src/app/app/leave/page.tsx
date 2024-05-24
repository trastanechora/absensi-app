'use client'

import Head from 'next/head';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  FormControl,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Autocomplete,
  TextField,
  Badge
} from '@mui/material';
import type { BadgeProps } from '@mui/material/Badge';
import LeaveIcon from '@mui/icons-material/WorkHistory';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/navigation";
import ApprovedIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/HelpOutline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

import { useNotificationContext } from '@/context/notification';
import { convertDateToLocaleString } from '@/app/lib/date';

import type { Leave } from '@/entity/model/leave';
import type { Approval } from '@/entity/model/approval';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    paddingLeft: 30,
  },
}));

const AppProfilePage = () => {
  const [_, dispatch] = useNotificationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenApprovalDialog, setIsOpenApprovalDialog] = useState(false);
  const [isOpenLeaveDialog, setIsOpenLeaveDialog] = useState(false);
  const fetchApprovalList = useRef(false);
  const listLeaveRef = useRef([]);
  const listApprovalRef = useRef([]);
  const selectedApproval = useRef({
    id: '',
    title: '',
  });
  const selectedLeave = useRef<Leave>({} as Leave);
  const [values, setValues] = useState<{ dateStart: string | null; dateEnd: string | null; approvers: { id: string }[][] }>({
    dateStart: null,
    dateEnd: null,
    approvers: []
  });
  const [approvalList, setApprovalList] = useState<{ name: string; users: { id: string; name: string }[] }[]>([])

  const handleValueChange = (prop: string, index?: number) => (event: any) => {
    if (index !== undefined) {
       const approvers = values.approvers;
       approvers[index] = event.target.value;
      setValues({ ...values, approvers });
      return;
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (values.dateStart === null || values.dateEnd === null) {
      dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: 'Mohon isi tanggal cuti', severity: 'error' } });
      return;
    }

    console.warn('[DEBUG] values', values);
    const acknolwledgeIds: string[] = [];
    const approvalIds: string[] = [];
    values.approvers.forEach((approverList, index) => {
      if (index === 0) {
        approverList.map((approver: { id: string }) => acknolwledgeIds.push(approver.id));
      } else {
        approverList.map((approver: { id: string }) => approvalIds.push(approver.id));
      }
    });

    console.warn('[DEBUG] payload', { acknolwledgeIds, approvalIds });
    
    fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalIds,
          acknolwledgeIds,
          dateStart: values.dateStart,
          dateEnd: values.dateEnd
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Pengajuan cuti berhasil`, severity: 'success' } });
          setTimeout(() => {
            router.push("/app");
          }, 2000);
        } else {
          const { error } = await res.json();
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal mengajukan cuti, Error: ${error}`, severity: 'error' } });
        }
      });
  };

  useEffect(() => {
    if (listApprovalRef.current.length === 0) {
      fetch(`/api/leave/history`)
      .then((res) => res.json())
      .then(responseObject => {
        listApprovalRef.current = responseObject.data.approvals;
        listLeaveRef.current = responseObject.data.leaves;
        setIsLoading(false);
        console.warn('[DEBUG] listApprovalRef', listApprovalRef);
        console.warn('[DEBUG] listLeaveRef', listLeaveRef);
      });
    }
  }, []);

  const handleOnApproval = useCallback(() => {
    if (selectedApproval.current.id) {
      // @ts-ignore
      fetch(`/api/approval/${selectedApproval.current.id}`, { method: 'PUT', body: JSON.stringify({
        status: 'approved'
      }) })
        .then((res) => res.json())
        .then(() => {
          setIsOpenApprovalDialog(false);
          // @ts-ignore
          dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Berhasil menyetujui ijin cuti untuk ${selectedApproval.current.title}`, severity: 'success' } });

          setIsLoading(true);
          router.push("/app");
        })
    }
  }, [dispatch, router]);

  const handleFetchApprovalList = useCallback(() => {
    if (fetchApprovalList.current) return;

    fetch(`/api/approval/list`)
      .then((res) => res.json())
      .then(responseObject => {
        console.warn('[DEBUG] responseObject', responseObject);
        setApprovalList(responseObject.data);
        // setValues
        const approvers: { id: string, name: string }[][] = [];
        responseObject.data.forEach((approver: { users: { id: string, name: string }[] }, index: number) => {
          if (index !== 0) {
            approvers[index] = [approver.users[0]];
          } else {
            approvers[index] = [];
          }
        });

        setValues(old => {
          return { ...old, approvers }
        });
        console.warn('[DEBUG] approvers', approvers);
      });

    fetchApprovalList.current = true;
    console.warn('[DEBUG] fetching approval list');
  }, []);

  console.warn('[DEBUG] values', values);

  const activeNotificationCount = listApprovalRef.current.filter(approval => approval.status === 'pending').length;

  return (
    <div>
      <Head>
        <title>Cuti | WASKITA - ABIPRAYA JO | Sistem Manajemen Absensi</title>
        <meta name="description" content="Sistem Manajemen Absensi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container disableGutters sx={{ width: '100%', px: '20px', my: '20px' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              onClick={handleFetchApprovalList}
            >
              Ajukan Cuti
            </AccordionSummary>
            <AccordionDetails>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                  <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                    <Box sx={{ width: '100%', paddingRight: 1 }}>
                      <FormControl fullWidth>
                        <DatePicker
                          label={'Tanggal Awal'}
                          value={values.dateStart}
                          maxDate={values.dateEnd ? dayjs(values.dateEnd) : ''}
                          onChange={value => handleValueChange('dateStart')({ target: { value: value !== null && typeof value !== 'string' ? value.format('YYYY-MM-DD') : null } })}
                          format="LL"
                          slotProps={{
                            textField: {
                              placeholder: '',
                              name: 'dateStart',
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
                          maxDate={dayjs(values.dateStart).set('month', dayjs(values.dateStart).month() + 1).set('date', 7)}
                          onChange={value => handleValueChange('dateEnd')({ target: { value: value?.format('YYYY-MM-DD') || null } })}
                          format="LL"
                          slotProps={{
                            textField: {
                              helperText: '',
                              name: 'dateStart',
                              style: { width: '100%' }
                            },
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                </Container>
                {approvalList.map((approval, index) => {
                  return (
                    <Container key={index} maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', marginTop: 2 }}>
                      <Autocomplete
                        fullWidth
                        id={`approvers-${index}`}
                        multiple={index === 0}
                        options={approval.users}
                        getOptionLabel={(option) => option.name}
                        defaultValue={index === 0 ? [] : approval.users[0]}
                        onChange={(_, value) => handleValueChange('approvers', index)({ target: { value } })}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={approval.name}
                          />
                        )}
                      />
                    </Container>
                  )
                })}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Ajukan
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <StyledBadge badgeContent={activeNotificationCount} color="error">
                Persetujuan Saya
              </StyledBadge>
              {/* {listApprovalRef.current.length !== 0 && <StyledBadge badgeContent={listApprovalRef.current.length} color="error">
                <LeaveIcon />
              </StyledBadge>} */}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mt: 1 }}>
                {listApprovalRef.current.length === 0 && !isLoading && (<Alert severity="info">Tidak ada permintaan ijin cuti</Alert>)}
                {listApprovalRef.current.map((approval: Approval, index) => {
                  const dateStart = new Date(approval.leave.dateStart);
                  const dateEnd = new Date(approval.leave.dateEnd);
                  const secondaryText = `${convertDateToLocaleString(dateStart)} - ${convertDateToLocaleString(dateEnd)}`;
                  const primaryText = `${approval.leave.user.name} (${approval.leave.dayCount} hari)`
                  return (
                    <List component="div" disablePadding key={index}>
                      <ListItemButton
                        onClick={() => {
                          if (approval.status !== 'pending') return;
                          selectedApproval.current = {
                            id: approval.id,
                            title: primaryText,
                          };
                          setIsOpenApprovalDialog(true);
                        }}
                      >
                        <ListItemIcon>
                          { approval.status === 'pending' ? <PendingIcon color="warning" /> : <ApprovedIcon color="success" /> }
                        </ListItemIcon>
                        <ListItemText
                          primary={primaryText}
                          secondary={secondaryText}
                        />
                      </ListItemButton>
                    </List>
                  )
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Riwayat Cuti
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mt: 1 }}>
                {listLeaveRef.current.length === 0 && !isLoading && (<Alert severity="info">Belum ada riwayat cuti</Alert>)}
                {listLeaveRef.current.map((leave: Leave, index) => {
                  const dateStart = new Date(leave.dateStart);
                  const dateEnd = new Date(leave.dateEnd);
                  const secondaryText = `${convertDateToLocaleString(dateStart)} - ${convertDateToLocaleString(dateEnd)}`;
                  const primaryText = `${leave.user.name} (${leave.dayCount} hari)`
                  return (
                    <List component="div" disablePadding key={index}>
                      <ListItemButton
                        onClick={() => {
                          selectedLeave.current = { ...leave, formattedDate: secondaryText, formattedDay: `${leave.dayCount} hari` };
                          setIsOpenLeaveDialog(true);
                        }}
                      >
                        <ListItemIcon>
                        { leave.status === 'pending' ? <PendingIcon color="warning" /> : <ApprovedIcon color="success" /> }
                        </ListItemIcon>
                        <ListItemText
                          primary={primaryText}
                          secondary={secondaryText}
                        />
                      </ListItemButton>
                    </List>
                  )
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Dialog
          open={isOpenApprovalDialog}
          onClose={() => setIsOpenApprovalDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Apakah Anda yakin?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Anda menyetujui untuk memberi ijin cuti {selectedApproval.current.title}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpenApprovalDialog(false)}>Tidak</Button>
            <Button onClick={handleOnApproval} autoFocus>
              Ya
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isOpenLeaveDialog}
          onClose={() => setIsOpenLeaveDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Info Cuti Anda
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <b>Tanggal:</b>
                </Box>
                <Box sx={{ width: '100%' }}>
                  {selectedLeave.current.formattedDate}
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <b>Hari Terhitung:</b>
                </Box>
                <Box sx={{ width: '100%' }}>
                  {selectedLeave.current.formattedDay}
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <b>Status:</b>
                </Box>
                <Box sx={{ width: '100%' }}>
                  {selectedLeave.current.status}
                </Box>
              </Container>
              <Container maxWidth={false} disableGutters sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
                <Box sx={{ width: '100%', display: 'flex', maxWidth: 'none' }}>
                  <b>Persetujuan:</b>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={-1} orientation="vertical">
                    {selectedLeave.current.approvals?.map(approval => {
                      const copyApproved = approval.type === 'acknoledge' ? 'Telah mengetahui' : 'Telah menyetujui';
                      const copyWaiting = approval.type === 'acknoledge' ? 'Pemberitahuan terkirim' : 'Menunggu persetujuan';
                      return (
                        <Step key={approval.id}>
                          <StepLabel
                            optional={
                              approval.status === 'approved'
                                ? <Typography sx={{ color: 'green' }} variant="caption">{copyApproved}</Typography>
                                : <Typography sx={{ color: 'orange' }} variant="caption">{copyWaiting}</Typography>}
                          >
                            {approval.user.name} {approval.type === 'acknoledge' ? '(Opsional)' : '' }
                          </StepLabel>
                        </Step>
                      )
                    })}
                  </Stepper>
                </Box>
              </Container>
              {/* {JSON.stringify(selectedLeave.current)} */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpenLeaveDialog(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  )
}

export default AppProfilePage;