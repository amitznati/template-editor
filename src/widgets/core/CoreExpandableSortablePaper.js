import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { sortableHandle } from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CoreSpeedActions from './CoreSpeedActions';

const DragHandle = sortableHandle(() => (
  <ReorderIcon style={{ cursor: 'move' }} />
));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 1)
  },
  noPadding: {
    padding: 0,
    opacity: '1 !important'
  }
}));

export default function CoreExpandableSortablePaper({
  header,
  actions,
  children,
  disabled,
  sortable = true
}) {
  const classes = useStyles();
  return (
    <Accordion className={classes.root} disabled={disabled}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classes.noPadding}
      >
        <Grid container justify='center' alignItems='center'>
          {sortable && (
            <Grid item xs={1}>
              <DragHandle />
            </Grid>
          )}
          <Grid item xs={9}>
            {header}
          </Grid>
          {actions && (
            <Grid item xs={2}>
              <CoreSpeedActions {...{ actions }} />
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.noPadding}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
