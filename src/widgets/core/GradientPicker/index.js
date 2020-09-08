import React from 'react';
import { SketchPicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import { Grid, ClickAwayListener } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import CoreNumber from '../CoreNumber';
import CoreSelect from '../CoreSelect';
import GradientBuilder from './GradientBuilder';
import withRoot from '../../../withRoot';

const styles = (theme) => ({
  popover: {
    position: 'absolute',
    zIndex: '2'
  },
  margin: {
    margin: theme.spacing(1)
  }
});

const getRgba = (rgba) => {
  return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
};

const WrappedSketchPicker = ({ onSelect, classes, ...rest }) => {
  if (rest && rest.isActive) {
    return (
      <div className={classes.popover}>
        <SketchPicker {...rest} onChange={(c) => onSelect(getRgba(c.rgb))} />
      </div>
    );
  }
  return '';
};

class GradientPicker extends React.Component {
  handleAngleChange = (angle) => {
    const { StartX: cx, StartY: cy, EndX, EndY } = this.props.gradientData;
    const p = { x: EndX, y: EndY };
    const c = Math.cos((angle * Math.PI) / 180.0);
    const s = Math.sin((angle * Math.PI) / 180.0);
    p.x -= cx;
    p.y -= cy;

    // rotate point
    const xnew = p.x * c - p.y * s;
    const ynew = p.x * s + p.y * c;

    // translate point back:
    p.x = xnew + cx;
    p.y = ynew + cy;
    return {
      Angle: angle,
      EndX: p.x,
      EndY: p.y
    };
  };

  handleChange = (values) => {
    let newValues = values;
    const { gradientData, onPaletteChange } = this.props;
    if (values.Angle) {
      newValues = this.handleAngleChange(values.Angle);
    }
    if (onPaletteChange) {
      onPaletteChange({ ...gradientData, ...newValues });
    }
  };

  render() {
    const { gradientData, classes } = this.props;
    const {
      palette,
      activeId,
      isActive,
      gradientType,
      spreadMethod
    } = gradientData;
    return (
      <div>
        <Grid container style={{ margin: '15px 0' }}>
          <Grid item xs={12}>
            <ToggleButtonGroup
              size='medium'
              exclusive
              value={gradientType}
              onChange={(event, gradientType) =>
                this.handleChange({ gradientType })
              }
            >
              <ToggleButton value='Linear'>
                Linear
                <i className='material-icons'>linear_scale</i>
              </ToggleButton>
              <ToggleButton value='Radial'>
                Radial
                <i className='material-icons'>all_out</i>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <ClickAwayListener
          onClickAway={() => this.handleChange({ isActive: false })}
        >
          <GradientBuilder
            {...{
              width: 250,
              height: 250,
              palette,
              activeId,
              gradientData,
              onPaletteChange: (palette) => this.handleChange({ palette }),
              onStepClick: (activeId) =>
                this.handleChange({ isActive: true, activeId }),
              onPointMove: (newVal) => this.handleChange(newVal)
            }}
          >
            <WrappedSketchPicker
              {...{
                width: 200,
                disableAlpha: false,
                isActive: isActive,
                classes
              }}
            />
          </GradientBuilder>
        </ClickAwayListener>

        <div>
          <Grid container>
            {['StartX', 'StartY', 'EndX', 'EndY'].map((name) => {
              return (
                <Grid item md={3} key={name} className={classes.margin}>
                  <CoreNumber
                    type='number'
                    label={name}
                    inputProps={{ min: '0', max: '1', step: '0.01' }}
                    margin='normal'
                    value={gradientData[name]}
                    onChange={(v) => this.handleChange({ [name]: v })}
                  />
                </Grid>
              );
            })}
            <Grid item md={6}>
              <CoreSelect
                options={['pad', 'reflect', 'repeat'].map((o) => {
                  return { id: o, name: o };
                })}
                label='Spread Method'
                value={spreadMethod}
                onChange={(v) => this.handleChange({ spreadMethod: v })}
              />
            </Grid>
            {gradientType === 'Radial' &&
              ['Angle', 'EndRadius'].map((name) => {
                return (
                  <Grid item md={3} key={name} className={classes.margin}>
                    <CoreNumber
                      type='number'
                      label={name}
                      inputProps={{ step: '0.1' }}
                      value={gradientData[name]}
                      onChange={(v) =>
                        this.handleChange({ [name]: v < 0 ? 0 : v })
                      }
                    />
                  </Grid>
                );
              })}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(GradientPicker));
