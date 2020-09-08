import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Drawer,
  Typography,
  Icon,
  IconButton,
  Toolbar,
  AppBar,
  CssBaseline
} from '@material-ui/core';
import TemplatePreview from '../../../TemplatePreview/widget/TemplatePreview.connect';
import LayoutsList from '../../../LayoutsList/widget/LayoutsList.connect';
import AddLayoutDialog from '../../../AddLayoutDialog/widget/AddLayoutDialog.connect';
import { CoreSlider } from '../../../core';
import FontLoader from '../../../../sdk/services/fontLoader';
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
    width: drawerWidth,
    background: '#ececec',
    zIndex: 'auto'
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
  addButton: {
    width: '30%',
    alignSelf: 'center'
  }
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
      allFontsLoaded,
      allFonts,
      updateScale,
      toggleAddLayoutDialog,
      handleAddClose,
      isAddLayoutDialogOpen,
      saveTemplate,
      setAllFontsLoaded,
      logos,
      product
    } = this.props;
    if (!product) {
      return <div>loading...</div>;
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AddLayoutDialog
          open={isAddLayoutDialogOpen}
          onClose={handleAddClose}
          logos={logos}
        />
        {/* <AddNewLayoutList open={isAddLayoutDialogOpen} onClose={() => handleAddClose({})} onSelect={handleAddClose} /> */}
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant='h6' noWrap>
              SVG Template Editor
            </Typography>
            <div className={classes.grow} />
            <IconButton color='inherit' onClick={saveTemplate}>
              <Icon>save</Icon>
            </IconButton>
            <IconButton color='inherit' onClick={toggleAddLayoutDialog}>
              <Icon>add</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label='mailbox folders'>
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant='permanent'
            open
          >
            <Button
              className={classes.addButton}
              variant='contained'
              color='primary'
              onClick={() => toggleAddLayoutDialog(true)}
            >
              + Add Layout
            </Button>
            <LayoutsList />
          </Drawer>
        </nav>
        <main className={classes.content}>
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
          <div className={classes.templatePaper} ref={this.templatePreviewRef}>
            {allFonts && allFonts.length > 0 && (
              <FontLoader
                fontProvider='google'
                fontFamilies={allFonts}
                onActive={setAllFontsLoaded}
              />
            )}
            {(allFontsLoaded || !allFonts || allFonts.length === 0) && (
              <TemplatePreview />
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(EditTemplateMainViewMainView));
