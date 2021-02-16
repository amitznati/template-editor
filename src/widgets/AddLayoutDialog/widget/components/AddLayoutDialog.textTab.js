import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { CoreText, RadioButtonsGroup } from '../../../core';

export default function TextTab({ onSelect, dynamicTextOptions = [] }) {
  const [value, setValue] = React.useState('');
  const dynamicOptions = dynamicTextOptions.map((o) => ({
    value: o,
    label: o
  }));
  const onAdd = (type) => {
    const payload = { type, value: { text: value } };
    if (dynamicTextOptions.includes(value)) {
      payload.value.dynamicOptionValue = value;
    }
    onSelect(payload);
  };
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <CoreText label='text' handleChange={setValue} value={value} />
      </Grid>
      <Grid item xs={12}>
        <RadioButtonsGroup
          value={value}
          onValueChange={setValue}
          label='Dynamic Text Options'
          name='text'
          options={dynamicOptions}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => onAdd('text')}
        >
          ADD as Text
        </Button>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => onAdd('textPath')}
        >
          ADD as Text-Path
        </Button>
      </Grid>
    </Grid>
  );
}
