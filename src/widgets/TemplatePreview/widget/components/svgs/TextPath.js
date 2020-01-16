import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from '../../../../../sdk/utils';

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
		pathData,
		filters
	} = layout.properties;
	let layoutFill = fill.fill;
	const shapes = [];
	const layoutProperties = {
		//x: pathData.path ? 0 : getPX(x),
		//y: pathData.path ? 0 : getPX(y),
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
	if (!pathData.path) {
		pathData.path = `M ${getPX(x)} ${getPX(y)} L ${getPX(x) + 200} ${getPX(y)}`;
	}
	shapes.push(getPathDef(`Path-${index}`, pathData));

	shapes.push(
		<text
			{...textProperties}
			{...styleFilter}
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
