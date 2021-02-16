import React from 'react';
import PropTypes from 'prop-types';
import { Grid, ButtonGroup, Button } from '@material-ui/core';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import { CoreNumber } from '../../../core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  buttonGroupWrap: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    margin: '1rem 0'
  },
  verticalIcon: {
    transform: 'rotate(90deg)'
  },
  fullAlignmentItem: {
    display: 'flex',
    justifyContent: 'center'
  }
});
const PositionProperties = ({
  layout,
  onPropertyChange: onPropChange,
  onAlignmentClick,
  onFullSizeClick
}) => {
  const { x, y, transform, alignment } = layout.properties;
  const classes = useStyles();
  const {
    skewY = 0,
    skewX = 0,
    scaleX = 1,
    scaleY = 1,
    translateX = 0,
    translateY = 0
  } = transform;
  const numberFields = [
    { name: 'x', title: 'X', value: x },
    { name: 'y', title: 'Y', value: y },
    { name: 'scaleX', title: 'Scale X', value: scaleX },
    { name: 'scaleY', title: 'Scale Y', value: scaleY },
    { name: 'translateX', title: 'Translate X', value: translateX },
    { name: 'translateY', title: 'Translate Y', value: translateY },
    { name: 'skewX', title: 'skewX', value: skewX },
    { name: 'skewY', title: 'skewY', value: skewY }
  ];

  const onPropertyChange = (name, value) => {
    if (['x', 'y'].includes(name)) {
      onPropChange(name, value);
    } else {
      onPropChange('transform', { ...transform, [name]: value });
    }
  };

  return (
    <Grid container>
      {numberFields.map((f) => {
        return (
          <Grid item xs={3} key={`positionProperty_${f.name}`}>
            <CoreNumber
              label={f.title}
              value={f.value}
              onChange={(v) => onPropertyChange(f.name, v)}
            />
          </Grid>
        );
      })}
      <Grid className={classes.buttonGroupWrap} item xs={12}>
        <ButtonGroup className={classes.buttonGroup}>
          {[
            { key: 'bottom', icon: <VerticalAlignBottomIcon /> },
            { key: 'center', icon: <VerticalAlignCenterIcon /> },
            { key: 'top', icon: <VerticalAlignTopIcon /> }
          ].map((align) => {
            let buttonStyle = {};
            if (
              alignment?.vertical?.align &&
              alignment?.vertical?.value === align.key
            ) {
              buttonStyle = { variant: 'contained', color: 'primary' };
            }
            return (
              <Button
                key={align.key}
                {...buttonStyle}
                onClick={() => onAlignmentClick('vertical', align.key)}
              >
                {align.icon}
              </Button>
            );
          })}
        </ButtonGroup>
        <ButtonGroup className={classes.buttonGroup}>
          {[
            {
              key: 'left',
              icon: <VerticalAlignBottomIcon className={classes.verticalIcon} />
            },
            {
              key: 'center',
              icon: <VerticalAlignCenterIcon className={classes.verticalIcon} />
            },
            {
              key: 'right',
              icon: <VerticalAlignTopIcon className={classes.verticalIcon} />
            }
          ].map((align) => {
            let buttonStyle = {};
            if (
              alignment?.horizontal?.align &&
              alignment?.horizontal?.value === align.key
            ) {
              buttonStyle = { variant: 'contained', color: 'primary' };
            }
            return (
              <Button
                key={align.key}
                {...buttonStyle}
                onClick={() => onAlignmentClick('horizontal', align.key)}
              >
                {align.icon}
              </Button>
            );
          })}
        </ButtonGroup>
      </Grid>
      {layout.type === 'image' && (
        <Grid item xs={12}>
          <Grid container>
            {['width', 'height'].map((dir) => (
              <Grid key={dir} item xs={6} className={classes.fullAlignmentItem}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => onFullSizeClick(dir)}
                >
                  Full {dir}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

PositionProperties.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  transform: PropTypes.object,
  onPropertyChange: PropTypes.func
};

export default PositionProperties;
