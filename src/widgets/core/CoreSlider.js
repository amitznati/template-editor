import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Input,
  FormControl,
  Typography,
  Slider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../styles/styles';

const CoreSlider = (props) => {
  const {
    classes,
    value,
    handleSliderChange,
    withNumberInput = true,
    label,
    max = 100,
    min = 0,
    step = 1
  } = props;
  return (
    <FormControl fullWidth>
      <Typography>{label}</Typography>
      <Grid container className={classes.sliderContainer}>
        <Grid item xs={withNumberInput ? 9 : 12}>
          <Slider
            value={value}
            className={classes.slider}
            onChange={(e, v) => handleSliderChange(Number(v))}
            max={max}
            min={min}
            step={step}
          />
        </Grid>
        {withNumberInput && (
          <Grid item xs={3}>
            <Input
              type='number'
              value={value}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
            />
          </Grid>
        )}
      </Grid>
    </FormControl>
  );
};

CoreSlider.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  handleSliderChange: PropTypes.func.isRequired,
  withNumberInput: PropTypes.bool,
  label: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number
};

export default withStyles(styles)(CoreSlider);
