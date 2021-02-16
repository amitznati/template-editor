import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid
} from '@material-ui/core';
import TemplatePreview from '../../../TemplatePreview/widget/TemplatePreview.connect';
import LayoutsList from '../../../LayoutsList/widget/LayoutsList.connect';
import AddLayoutDialog from '../../../AddLayoutDialog/widget/AddLayoutDialog.connect';
import { CoreSlider } from '../../../core';
import withRoot from '../../../../withRoot';
// import AddNewLayoutList from './AddNewLayoutList';

const drawerWidth = 500;

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflow: 'auto'
  },
  section: {
    padding: '20px 0'
  },
  templatePaper: {
    position: 'relative',
    overflow: 'auto',
    padding: '20px',
    margin: 0,
    background: '#ececec'
  },
  rootGrid: {
    padding: theme.spacing(1)
  },
  grow: {
    flexGrow: 1
  },
  addButton: {}
});

class EditTemplateMainViewMainView extends React.Component {
  constructor(props) {
    super(props);
    this.templatePreviewRef = React.createRef();
  }

  render() {
    const {
      classes,
      scale,
      updateScale,
      toggleAddLayoutDialog,
      handleAddClose,
      isAddLayoutDialogOpen,
      logos,
      initialData: { product }
    } = this.props;
    if (!product) {
      return <div>No Product...</div>;
    }
    return (
      <div>
        <AddLayoutDialog
          open={isAddLayoutDialogOpen}
          onClose={handleAddClose}
          logos={logos}
        />
        <Grid container>
          <Grid item xs={12} sm={12} md={3}>
            <div className={classes.drawerPaper}>
              <Button
                className={classes.addButton}
                variant='contained'
                color='primary'
                onClick={() => toggleAddLayoutDialog(true)}
              >
                + Add Layout
              </Button>
              <LayoutsList />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <div className={classes.toolbar} />
            <CoreSlider
              label='Scale'
              value={scale}
              max={30}
              step={0.001}
              handleSliderChange={(v) =>
                updateScale(Number(Number(v).toFixed(2)))
              }
            />
            <div
              className={classes.templatePaper}
              ref={this.templatePreviewRef}
            >
              <TemplatePreview />
            </div>
          </Grid>
        </Grid>
        {/* <AddNewLayoutList open={isAddLayoutDialogOpen} onClose={() => handleAddClose({})} onSelect={handleAddClose} /> */}
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(EditTemplateMainViewMainView));
