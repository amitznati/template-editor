import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  label: { padding: '1rem' },
  buttonsGroup: { display: 'flex' }
});

export default function CoreThemeVariantSelect({
  value,
  onSelect,
  options = [],
  title,
  ...rest
}) {
  const classes = useStyles();
  return (
    <Paper {...rest}>
      <span className={classes.label}>{title}</span>
      <Grid container className={classes.buttonsGroup}>
        <Grid item xs={12}>
          <Button
            variant={value ? 'text' : 'outlined'}
            color={value ? 'default' : 'primary'}
            onClick={() => onSelect(undefined)}
          >
            None
          </Button>
        </Grid>
        {options.map((option) => {
          const btnProps = {
            onClick: () => onSelect(option)
          };
          if (value === option) {
            btnProps.variant = 'outlined';
            btnProps.color = 'primary';
          }
          return (
            <Grid key={option} item xs={4}>
              <Button {...btnProps}>{option}</Button>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
