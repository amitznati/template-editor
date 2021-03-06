/* eslint-disable react/prop-types */
import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './CoreSelect.css';
import { makeStyles } from '@material-ui/core/styles';
// import styles from '../../styles/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
}));

const SimpleSelect = (props) => {
  const classes = useStyles();
  const { value = '', onChange, options, disabled } = props;
  function handleChange(event) {
    onChange && onChange(event.target.value);
  }

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel htmlFor='age-simple'>{props.label}</InputLabel>
      <Select value={value} onChange={handleChange}>
        {options &&
          options.map((o) => {
            return (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};
export default SimpleSelect;
