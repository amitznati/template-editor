import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import shapesData from './shapesData';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 1)
  },
  shapeContainer: {
    margin: '1rem'
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
  }
}));

export default function ShapesTab({ onSelect }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container>
        {shapesData.map((shape) => {
          return (
            <Grid key={shape.id} item xs={3} className={classes.shapeContainer}>
              <Paper
                className={classes.paper}
                onClick={() => onSelect({ type: 'shape', value: shape })}
              >
                <svg>{shape.svg}</svg>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
