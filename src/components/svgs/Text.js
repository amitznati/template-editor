import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from './../../utils';

const getGradientDef = (id, gradientData) => {
	const {gradientType, EndY, EndX, StartX, StartY, EndRadius, palette} = gradientData;
	const stops = palette.map((point, index) => {
		return <stop key={`stop-${index}`} offset={point.pos} stopColor={point.color} />;
	});
	let shape = '';
	switch (gradientType) {
	case 'Linear': {
		shape = (
			<linearGradient id={id} x1={`${StartX}%`} y1={`${StartY}%`} x2={`${EndX}%`} y2={`${EndY}%`}>
				{stops}
			</linearGradient>
		);
		break;
	}
	case 'Radial': {
		shape = (
			<radialGradient id={id} cx={`${StartX}%`} cy={`${StartY}%`} r={`${EndRadius}%`} fx={`${EndX}%`} fy={`${EndY}%`}>
				{stops}
			</radialGradient>
		);
		break;
	}
	default: 
		return '';
	}

	return (
		<defs key={id}>
			{shape}
		</defs>
	);
};


const Text = (props) => {
	
	const textRef = React.createRef();
	const {layout, index} = props;
	const {fontFamily, fontSize, fontWeight, x, y, text, fill,
		transform: {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0}
	} = layout.properties;
	const {selectedFillColorType, gradientData} = fill;
	let layouFill = fill.fill;
	const shapes = [];
	const layoutProperties = {
		x: getPX(x),
		y: getPX(y),
		transform: `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`,
	};

	if (selectedFillColorType === 'Gradient' && gradientData) {
		layouFill = `url(#Gradient-${index})`;
		shapes.push(getGradientDef(`Gradient-${index}`, gradientData));
	}

	const textProperties = {
		fontFamily,
		fontSize, 
		fontWeight,
		fill: layouFill,
		...layoutProperties
	};

	shapes.push(
		<text
			{...textProperties}
			className={cx('drag-svg')}
			name={index}
			key={`text_${index}`}
			ref={textRef}
			layoutindex={index}
		>
			{text}
		</text>
	);
	

	return shapes;
	
};

Text.propTypes = {
	layout: PropTypes.object,
	index: PropTypes.any
};

export default Text;