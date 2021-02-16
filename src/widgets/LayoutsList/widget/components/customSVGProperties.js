import React from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  DialogTitle
} from '@material-ui/core';
import CustomSVGTab from '../../../AddLayoutDialog/widget/components/AddLayoutDialog.customSVGTab';
import CloseIcon from '@material-ui/icons/Close';

const CustomSVGProperties = ({ src, onEdit }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const onEditDone = (newSrc) => {
    setDialogOpen(false);
    if (newSrc && onEdit) {
      onEdit(newSrc.value);
    }
  };
  return (
    <Grid container>
      <Dialog onClose={() => setDialogOpen(false)} fullScreen open={dialogOpen}>
        <DialogTitle id='simple-dialog-title'>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                color='inherit'
                onClick={() => setDialogOpen(false)}
                aria-label='Close'
              >
                <CloseIcon />
              </IconButton>
              <Typography variant='h6' color='inherit'>
                Custom SVG
              </Typography>
            </Toolbar>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          <CustomSVGTab src={src} onSelect={onEditDone} addText='Edit' />
        </DialogContent>
      </Dialog>
      <Grid item xs={12}>
        <svg>
          <g dangerouslySetInnerHTML={{ __html: src }} />
        </svg>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={() => setDialogOpen(true)}>Edit</Button>
      </Grid>
    </Grid>
  );
};

export default CustomSVGProperties;
