import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Grid} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../../styles/styles';

export const ImageLayoutHeader = props => {
	const {layout} = props;
	return (
		<Grid container alignItems="center">
			<Grid item xs={12}>
				<Avatar alt="Remy Sharp" src={layout.properties.src}  />
			</Grid>
		</Grid>
	);
};

ImageLayoutHeader.propTypes = {
	//classes: PropTypes.object.isRequired,
	layout: PropTypes.object.isRequired,
};

export const TextLayoutHeader = props => {
	const {layout} = props;
	return (
		<Grid container alignItems="center">
			<Grid item xs={12}>
				{layout.properties.text}
			</Grid>
		</Grid>
	);
};

TextLayoutHeader.propTypes = {
	//classes: PropTypes.object.isRequired,
	layout: PropTypes.object.isRequired,
};


export default {
	ImageLayoutHeader: withStyles(styles)(ImageLayoutHeader),
	TextLayoutHeader: withStyles(styles)(TextLayoutHeader),
};
