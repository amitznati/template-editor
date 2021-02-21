import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Chip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Gradients from '../../../Gradients/widget/Gradients.connect';
import { CoreColorPicker } from '../../../core';

class ColorProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerOpen: false,
      strokeAnchorEl: null
    };
  }

  handleColorOpen = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleColorClose = () => {
    this.setState({ anchorEl: null });
  };

  handleFillColorChange = (color) => {
    const { onPropertyChange } = this.props;
    const fill = {
      fill: color
    };
    onPropertyChange && onPropertyChange('fill', fill);
  };

  onThemeColorSelect = (themeColor) => {
    const { onPropertyChange } = this.props;
    onPropertyChange('themeColor', themeColor);
  };

  renderFillField = () => {
    const { fill, themeColor, dynamicColorOptions } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? 'fill-color-popover' : undefined;
    const { fill: color } = fill || {};
    return (
      <Grid container>
        <Grid item>
          <Button
            aria-describedby={id}
            size='large'
            onClick={this.handleColorOpen}
            style={{
              background: color,
              marginTop: '16px',
              color: 'white',
              WebkitTextStrokeColor: 'black',
              WebkitTextStrokeWidth: '0.5px'
            }}
          >
            fill color
          </Button>
          {themeColor && (
            <Chip variant='outlined' color='primary' label={themeColor} />
          )}
          <CoreColorPicker
            handleClose={this.handleColorClose}
            onChange={this.handleFillColorChange}
            onThemeColorSelect={this.onThemeColorSelect}
            {...{
              anchorEl,
              dynamicColorOptions,
              id,
              color,
              themeColor,
              open
            }}
          />
        </Grid>
      </Grid>
    );
  };

  renderFillGradientField = () => {
    return <Gradients />;
  };

  fillColorFields = {
    Fill: this.renderFillField,
    Gradient: this.renderFillGradientField
  };

  handleFillColorTypeChange = (event, fillColorType) => {
    if (!fillColorType) return;
    const { onPropertyChange } = this.props;
    const selectedFillColorType = fillColorType;
    onPropertyChange &&
      onPropertyChange('fill', {
        selectedFillColorType,
        fill: 'black'
      });
  };

  render() {
    const { fill } = this.props;
    const { selectedFillColorType = 'Fill' } = fill;
    return (
      <Grid container>
        <Grid item xs={12}>
          Fill Color
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            size='medium'
            exclusive
            value={selectedFillColorType}
            onChange={this.handleFillColorTypeChange}
          >
            <ToggleButton value='Fill'>
              Fill
              <i className='material-icons'>format_color_fill</i>
            </ToggleButton>
            <ToggleButton value='Gradient'>
              Gradient
              <i
                className='material-icons'
                style={{ transform: 'rotate(-90deg)' }}
              >
                gradient
              </i>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item md={12}>
          {this.fillColorFields[selectedFillColorType]()}
        </Grid>
      </Grid>
    );
  }
}

ColorProperties.propTypes = {
  fill: PropTypes.any,
  onPropertyChange: PropTypes.func
};

export default ColorProperties;
