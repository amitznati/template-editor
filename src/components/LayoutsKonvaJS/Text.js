import React from 'react';
import cx from 'classnames';
import {getPX} from './../../utils';


const Text =({...props}) => {

	const textRef = React.createRef();
	const {scale, layout, index} = props;
	const {fontFamily, fontSize, fontWeight, x, y, text,
		transform: {skewY=0,skewX=0, scaleX=1, scaleY=1, translateX = 0, translateY = 0}
	} = layout.properties;
	
	const textProperties = {
		fontFamily,
		fontSize, 
		fontWeight,
		x: getPX(x),
		y: getPX(y),
		transform: `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`
	};
	return (
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
}

export default Text;