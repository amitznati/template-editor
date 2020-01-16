import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from '../../../../../sdk/utils';

const Text = (props) => {

	const textRef = React.createRef();
	const {layout, index} = props;
	const {fontFamily, fontSize, fontWeight, x, y, text, fill,
		transform: {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0},
		filters
	} = layout.properties;
	const layoutFill = fill.fill;
	const shapes = [];
	const layoutProperties = {
		x: getPX(x),
		y: getPX(y),
		transform: `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`,
	};

	const styleFilter = {};
	if (filters.length) {
		styleFilter.style = {
			filter: filters.map(f => `url(#${f})`).join(' ')
		};
	}

	const textProperties = {
		fontFamily,
		fontSize,
		fontWeight,
		fill: layoutFill,
		...layoutProperties
	};

	shapes.push(
		<text
			{...textProperties}
			{...styleFilter}
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
