import React from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import { CoreNumber } from '../core';
const PositionProperties = (props) => {
	const {x, y, transform} = props;
	const {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0} = transform;
	const numberFields = [
		{name: 'x', title: 'X', value: x},
		{name: 'y', title: 'Y', value: y},
		{name: 'scaleX', title: 'Scale X', value: scaleX},
		{name: 'scaleY', title: 'Scale Y', value: scaleY},
		{name: 'translateX', title: 'Translate X', value: translateX},
		{name: 'translateY', title: 'Translate Y', value: translateY},
		{name: 'skewX', title: 'skewX', value: skewX},
		{name: 'skewY', title: 'skewY', value: skewY},
	];

	const onPropertyChange = (name, value) => {
		if (['x','y'].includes(name)) {
			props.onPropertyChange && props.onPropertyChange(name, value);
		} else {
			props.onPropertyChange && props.onPropertyChange('transform', {...transform, [name]: value});
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
							onChange={v => onPropertyChange(f.name, v)}/>
					</Grid>
				);
			})}
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