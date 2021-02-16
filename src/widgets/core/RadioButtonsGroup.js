import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function RadioButtonsGroup({
  name,
  label,
  options,
  value,
  onValueChange
}) {
  const handleChange = (event) => {
    onValueChange(event.target.value);
  };

  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={<Radio />}
            {...option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
