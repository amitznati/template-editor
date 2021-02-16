import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import {
  CustomSVGHeader,
  ImageLayoutHeader,
  TextLayoutHeader,
  LogoHeader
} from './layoutsHeaders';
import { CoreExpandableSortablePaper, CoreSortableList } from './../../../core';

const styles = (theme) => ({
  layoutPaper: {
    margin: theme.spacing(1, 0),
    marginLeft: 0
  },
  layoutGrid: {
    // height: '50px'
  }
});
function LayoutsListClose({
  classes,
  layouts,
  onSortEnd,
  onLayoutClick,
  setIgnoreLayout,
  onDeleteLayout,
  onDuplicateLayout
}) {
  const getLayoutHeader = (l, i) => {
    switch (l.type) {
      case 'image':
        return <ImageLayoutHeader key={i} layout={l} />;
      case 'text':
      case 'textPath':
        return <TextLayoutHeader key={i} layout={l} />;
      case 'customSVG':
        return <CustomSVGHeader key={i} layout={l} />;
      case 'logo':
        return <LogoHeader key={i} />;
      default:
        return '';
    }
  };

  const renderLayout = (l, i) => {
    const actions = [
      {
        icon: 'file_copy',
        name: 'Duplicate',
        callback: () => onDuplicateLayout(i)
      },
      { icon: 'delete', name: 'Delete', callback: () => onDeleteLayout(i) },
      {
        icon: l.isIgnore ? 'visibility_off' : 'visibility',
        name: 'Toggle Ignore',
        callback: () => setIgnoreLayout(i)
      }
    ];
    return (
      <div className={classes.layoutPaper}>
        <CoreExpandableSortablePaper
          header={getLayoutHeader(l, i)}
          actions={actions}
          disabled={l.isIgnore}
        >
          something
        </CoreExpandableSortablePaper>
      </div>
    );
  };

  const items = layouts.map((l, i) => renderLayout(l, i));
  const onItemClick = (index) => {
    if (!layouts[index].isIgnore) {
      onLayoutClick(index);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <CoreSortableList
          items={items}
          useDragHandle
          onItemClick={onItemClick}
          onSortEnd={onSortEnd}
        />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(LayoutsListClose);
