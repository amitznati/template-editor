import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Toolbar,
  AppBar,
  Tabs,
  Tab,
  Typography,
  IconButton
} from '@material-ui/core';
import ShapesBuilder from '../../../ShapesBuilder/widget/ShapesBuilder.connect';

import TextTab from './AddLayoutDialog.textTab';
import ImageTab from './AddLayoutDialog.imageTab';
import CustomSVGTab from './AddLayoutDialog.customSVGTab';

class AddLayoutDialogMainView extends React.Component {
  state = {
    value: 0,
    text: ''
  };

  handleClose = () => {
    this.props.onClose({});
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      open,
      onClose,
      dynamicTextOptions,
      dynamicImageOptions,
      selectedTheme,
      uploadedImages
    } = this.props;
    const { value } = this.state;
    return (
      <Dialog
        onClose={this.handleClose}
        fullScreen
        open={open}
        aria-labelledby='simple-dialog-title'
      >
        <DialogTitle id='simple-dialog-title'>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                color='inherit'
                onClick={this.handleClose}
                aria-label='Close'
              >
                <CloseIcon />
              </IconButton>
              <Typography variant='h6' color='inherit'>
                Add Layout
              </Typography>
            </Toolbar>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label='Logo' />
              <Tab label='Image' />
              <Tab label='Text' />
              <Tab label='Shape' />
              <Tab label='Custom SVG' />
            </Tabs>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          {value === 0 && (
            <Button onClick={() => onClose({ type: 'logo' })}>Add Logo</Button>
          )}
          {value === 1 && (
            <ImageTab
              onSelect={onClose}
              {...{
                uploadedImages,
                selectedTheme,
                dynamicImageOptions
              }}
            />
          )}
          {value === 2 && (
            <TextTab
              onSelect={onClose}
              dynamicTextOptions={dynamicTextOptions}
            />
          )}
          {value === 3 && <ShapesBuilder />}
          {value === 4 && <CustomSVGTab onSelect={onClose} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddLayoutDialogMainView;
