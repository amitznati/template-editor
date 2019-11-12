import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from './../../utils';
import {getGradientDef} from './../../components/core/GradientBuilder';


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