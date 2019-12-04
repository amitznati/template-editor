
import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import {Popover} from '@material-ui/core';

const getRgba = (rgba) => {
	return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
};

const CoreColorPicker = ({...props}) => {
	const {handleClose, onChange, open, id, anchorEl, color} = props;

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
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
		>
			<SketchPicker color={color} onChange={handleChange} />
		</Popover>
	);

};

CoreColorPicker.propTypes = {
	onChange: PropTypes.func,
	color: PropTypes.any
};

export default CoreColorPicker;
