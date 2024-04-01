import { forwardRef, useEffect, useRef, useState } from 'react';
import { Container, Box, Button, Typography, Slide, Dialog, AppBar, Toolbar, IconButton } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { Camera } from "react-camera-pro";

interface Props {
  isOpen: boolean;
  type: string;
  handleClickClose: () => void;
  handleSubmit: (base64: string) => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogCamera = ({ isOpen, type, handleClickClose, handleSubmit }: Props) => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(1);
  const [image, setImage] = useState(null);

  const handleClose = () => {
    setImage(null);
    handleClickClose();
  }

  useEffect(() => {
    if (numberOfCameras === 0) {
      console.warn('Perangkat Anda tidak memiliki kamera yang didukung');
    }
  }, [numberOfCameras]);

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{ maxWidth: 430, margin: 'auto' }}
    >
      <AppBar sx={{ position: 'fixed', bottom: 0, top: 'initial' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div"></Typography>
          {image && <Button color="inherit" onClick={() => {
            setImage(null);
          }}>
            Ulang
          </Button>}
          {image && <Button color="inherit" onClick={() => {
            handleSubmit(image);
            handleClose();
          }}>
            {type === 'in' ? 'Clock In' : 'Clock Out'}
          </Button>}
          {!image && (
            <Button disabled={camera.current === null} color="inherit" onClick={() => {
              // @ts-ignore
              const photo = camera.current?.takePhoto();
              setImage(photo);

              // console.warn('[DEBUG] photo', photo);              
              // fetch(photo)
              //   .then(res => res.blob())
              //   .then(blob => {
              //     const file = new File([blob], "File name", { type: "image/png" });
              //     console.warn('[DEBUG] processed file', file);
              //   })
            }}>
              Ambil Foto
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container disableGutters sx={{ width: '100%', display: 'flex' }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          {image && <img src={image} alt='Image preview' width="100%" />}
          {!image && (
            // @ts-ignore
            <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} />
          )}
        </Box>
      </Container>
    </Dialog>
  );
}

export default DialogCamera;