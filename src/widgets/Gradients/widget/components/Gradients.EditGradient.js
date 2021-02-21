import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import {
  CoreGradientPicker,
  CoreExpandableSortablePaper,
  CoreText
} from '../../../core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 0)
  }
}));

export default function EditGradient({
  onGradientChange,
  selectedGradient,
  removeGradientFromLayout,
  onGradientNameChange,
  dynamicColorOptions
}) {
  const classes = useStyles();
  const gradientHeader = () => {
    return (
      <Grid>
        <CoreText
          value={selectedGradient.name}
          label='Gradient Name'
          handleChange={onGradientNameChange}
        />
      </Grid>
    );
  };

  const actions = [
    { icon: 'file_copy', name: 'Duplicate' },
    {
      icon: 'delete',
      name: 'Remove from layout',
      callback: () => removeGradientFromLayout()
    }
  ];

  return (
    <CoreExpandableSortablePaper
      className={classes.root}
      sortable={false}
      header={gradientHeader()}
      actions={actions}
    >
      <CoreGradientPicker
        onPaletteChange={onGradientChange}
        gradientData={selectedGradient.gradientData}
        dynamicColorOptions={dynamicColorOptions}
      />
    </CoreExpandableSortablePaper>
  );
}
