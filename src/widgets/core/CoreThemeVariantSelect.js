import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button } from '@material-ui/core';

const useStyles = makeStyles({
  label: { padding: '1rem' },
  buttonsGroup: { display: 'flex' }
});

export default function CoreThemeVariantSelect({ value, onSelect, ...rest }) {
  const classes = useStyles();
  return (
    <Paper {...rest}>
      <span className={classes.label}>Theme Variant Select</span>
      <div className={classes.buttonsGroup}>
        {['none', 'primary', 'secondary', 'tertiary'].map((themeColor) => {
          const isNone = themeColor === 'none';
          const btnProps = {
            onClick: () => onSelect(isNone ? '' : themeColor)
          };
          if (value === themeColor || (isNone && !value)) {
            btnProps.variant = 'outlined';
            btnProps.color = 'primary';
          }
          return (
            <Button key={themeColor} {...btnProps}>
              {themeColor}
            </Button>
          );
        })}
      </div>
    </Paper>
  );
}
