import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from './../../utils';
import {getGradientDef} from './../../components/core/GradientBuilder';

const getPathDef = (id, pathData) => {
	const path = pathData.path;
	return (
		<defs key={id}>
			<path id={id} fill="none" d={path} />
		</defs>
	);
};

const TextPath = (props) => {
	
	const textRef = React.createRef();
	const {layout, index} = props;
	const {fontFamily, fontSize, fontWeight, x, y, text, fill,
		transform: {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0},
		pathData
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
	if (!pathData.path) {
		pathData.path = `M ${getPX(x)} ${getPX(y)} 1000 ${getPX(y)}`;
	}
	shapes.push(getPathDef(`Path-${index}`, pathData));

	shapes.push(
		<text
			{...textProperties}
			className={cx('drag-svg')}
			ref={textRef}
			key={`path_${index}`}
			layoutindex={index}
		>
			<textPath 
				
				layoutindex={index}
				name={index}
				href={`#Path-${index}`}>
				{text}
			</textPath>
			
		</text>
	);

	return shapes;
	
};

TextPath.propTypes = {
	layout: PropTypes.object.isRequired,
	index: PropTypes.any.isRequired
};

export default TextPath;