import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  isOpen: boolean;
  handleClickClose: () => void;
}

const DialogPermission = ({ isOpen, handleClickClose }: Props) => {
  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tidak dapat mengakses lokasi Anda"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Beri ijin aplikasi ini untuk mengakses lokasi perangkat supaya dapat melakukan Clock in dan Clock out.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DialogPermission;