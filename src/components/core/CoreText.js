import React from 'react';
import PropTypes from 'prop-types';
import {TextField, FormControl} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './../../styles/styles';

const CoreText = props => {
	const {value, handleChange, label, type = 'text', onFocus} = props;
	return (
		<FormControl fullWidth >
			<TextField
				type={type}
				label={label}
				value={value}
				onFocus={onFocus}
				onChange={(e) => handleChange && handleChange(e.target.value)}
			/>
		</FormControl>
	);
};

CoreText.propTypes = {
	classes: PropTypes.object.isRequired,
	value: PropTypes.any.isRequired,
	handleChange: PropTypes.func,
	label: PropTypes.string.isRequired,
	type: PropTypes.string
};

export default withStyles(styles)(CoreText);