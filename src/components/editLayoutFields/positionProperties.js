import React from 'react';
import {Grid} from '@material-ui/core';
import { CoreNumber } from '../core';
const PositionProperties = (props) => {
	const {layout: {properties: {x, y, rotation = 0, scaleX = 1, scaleY = 1 }}} = props;
	const numberFields = [
		{name: 'x', title: 'X', value: x},
		{name: 'y', title: 'Y', value: y},
		{name: 'scaleX', title: 'Scale X', value: scaleX},
		{name: 'scaleY', title: 'Scale Y', value: scaleY},
		{name: 'rotation', title: 'rotation', value: rotation},
	]

	const onPropertyChange = (name, value) => {
		props.onPropertyChange && props.onPropertyChange(name, value)
	}
	return (
		<Grid container>
			{numberFields.map((f) => {
				return (
					<Grid item xs={3} key={`positionProperty_${f.name}`}>
						<CoreNumber
							label={f.title}
							value={f.value}
							onChange={v => onPropertyChange(f.name, v)}/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default PositionProperties;