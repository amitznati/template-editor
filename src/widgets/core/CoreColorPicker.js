import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@material-ui/core';
import { SketchPicker } from 'react-color';
import CoreThemeVariantSelect from './CoreThemeVariantSelect';

const getRgba = (rgba) => {
  return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
};

const CoreColorPicker = ({
  handleClose,
  onChange,
  open,
  id,
  anchorEl,
  color,
  onThemeColorSelect,
  themeColor,
  dynamicColorOptions
}) => {
  const handleChange = (color) => {
    onChange && onChange(getRgba(color.rgb));
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      {onThemeColorSelect && (
        <CoreThemeVariantSelect
          onSelect={onThemeColorSelect}
          value={themeColor}
          options={dynamicColorOptions}
          title='Dynamic Color Option'
        />
      )}
      <SketchPicker color={color} onChange={handleChange} />
    </Popover>
  );
};

CoreColorPicker.propTypes = {
  onChange: PropTypes.func,
  color: PropTypes.any
};

export default CoreColorPicker;
