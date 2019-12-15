import React from 'react';
import {Button, FormControl} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './../../styles/styles';
import {CoreColorPicker} from './index';

const CoreColorPickerButton = props => {
	const {btnText, color, handleChange} = props;
	const [anchorEl, setAnchorEl] = React.useState(null);

	return (
		<FormControl fullWidth >
			<Button size="large" onClick={(e) => setAnchorEl(e.target)} style={{background: color, textTransform: 'none'}}>
				{btnText || 'color'}
			</Button>
			<CoreColorPicker
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				handleClose={() => setAnchorEl(null)}
				onChange={handleChange}
				color={color}
			/>
		</FormControl>
	);
};

export default withStyles(styles)(CoreColorPickerButton);
