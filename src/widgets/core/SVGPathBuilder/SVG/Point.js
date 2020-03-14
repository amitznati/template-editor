/* eslint-disable react/prop-types */
import React from 'react';

function Point(props) {
	const {
		x,
		y,
		drag,
		index,
		scale
	} = props;

	return (
		<circle
			style={{strokeWidth: 5 / scale}}
			className="ad-Point"
			onMouseDown={ (e) => drag(e, index) }
			cx={ x }
			cy={ y }
			r={ 8 / scale } />
	);
}

export default Point;
