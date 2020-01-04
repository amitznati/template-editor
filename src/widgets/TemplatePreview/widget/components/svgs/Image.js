import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getPX} from '../../../../../sdk/utils';

const Image = (props) => {

	const textRef = React.createRef();
	const {layout, index} = props;
	const {x, y,
		transform: {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0},
		filters,
		src
	} = layout.properties;
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


	return (
		<image
			{...layoutProperties}
			{...styleFilter}
			href={src}
			className={cx('drag-svg')}
			name={index}
			key={`image_${index}`}
			ref={textRef}
			layoutindex={index}
		/>
	);

};

Text.propTypes = {
	layout: PropTypes.object,
	index: PropTypes.any
};

export default Image;
