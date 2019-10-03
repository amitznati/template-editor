import React from 'react';
import PropTypes from 'prop-types';
import {TextField, FormControl} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './../../styles/styles';

const CoreNumber = props => {
	// eslint-disable-next-line no-unused-vars
	const {classes, handleTextChange, ...rest} = props;
	return (
		<FormControl fullWidth >
			<TextField
				{...rest}
				type="number"
				onChange={(e) => props.onChange && props.onChange(Number(e.target.value))}
			/>
		</FormControl>
	);
};

CoreNumber.propTypes = {
	classes: PropTypes.object.isRequired,
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func,
	label: PropTypes.string.isRequired,
	type: PropTypes.string,
	onFocus: PropTypes.func
};

export default withStyles(styles)(CoreNumber);