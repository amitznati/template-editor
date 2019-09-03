import React from 'react';
import {Grid} from '@material-ui/core';
import { CoreNumber } from '../core';
const PositionProperties = (props) => {
	const {layout: {properties: {x, y, scaleX, scaleY, rotate}}} = props;
	const numberFields = [
		{name: 'x', title: 'X', value: x},
		{name: 'y', title: 'Y', value: y},
		{name: 'scaleX', title: 'Scale X', value: scaleX},
		{name: 'scaleY', title: 'Scale Y', value: scaleY},
		{name: 'rotate', title: 'Rotate', value: rotate}
	]
	return (
		<Grid container>
			{numberFields.map((f) => {
				return (
					<Grid item xs={3} >
						<CoreNumber
							label={f.title}
							value={f.value}
							onChange={v => props.onPropertyChange && props.onPropertyChange(f.name, v)}/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default PositionProperties;