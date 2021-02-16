import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Chip, Grid } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styles from '../../../../styles/styles';

const useStyles = makeStyles({
  imageRow: {
    display: 'flex',
    alignItems: 'center'
  },
  themeImageChip: {
    margin: '0 1rem'
  }
});

export const ImageLayoutHeader = (props) => {
  const {
    layout: {
      properties: { src, themeImage }
    }
  } = props;
  const classes = useStyles();
  return (
    <Grid container alignItems='center'>
      <Grid item xs={12} className={classes.imageRow}>
        <Avatar alt='Remy Sharp' src={src} />
        {themeImage && (
          <Chip
            className={classes.themeImageChip}
            variant='outlined'
            color='primary'
            label={themeImage}
          />
        )}
      </Grid>
    </Grid>
  );
};

ImageLayoutHeader.propTypes = {
  // classes: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired
};

export const TextLayoutHeader = (props) => {
  const { layout } = props;
  const classes = useStyles();
  return (
    <Grid container alignItems='center'>
      <Grid item xs={12}>
        {layout.properties.text}
        {layout.properties.dynamicOptionValue && (
          <Chip
            className={classes.themeImageChip}
            variant='outlined'
            color='primary'
            label={layout.properties.dynamicOptionValue}
          />
        )}
      </Grid>
    </Grid>
  );
};

export const CustomSVGHeader = ({ layout }) => {
  return (
    <Grid container alignItems='center'>
      <Grid item xs={12}>
        <svg
          viewBox='0 0 100 100'
          height='80px'
          width='80px'
          dangerouslySetInnerHTML={{ __html: layout.properties.src }}
        />
      </Grid>
    </Grid>
  );
};

TextLayoutHeader.propTypes = {
  // classes: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired
};

export const LogoHeader = () => <div>Logo</div>;
export default {
  ImageLayoutHeader,
  LogoHeader,
  TextLayoutHeader: withStyles(styles)(TextLayoutHeader),
  CustomSVGHeader: withStyles(styles)(CustomSVGHeader)
};
