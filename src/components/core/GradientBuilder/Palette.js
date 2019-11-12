import React from 'react';
import PropTypes from 'prop-types';
import {getGradientDef} from './index';
import './Palette.css';
import DraggableCircle from '../CoreDraggableElement';

const Palette = ({  width, height, gradientData, onPointMove }) => {

	const gradientId = '_' + Math.random().toString(36).substr(2, 9);
	const gradientUrl = `url(#${gradientId})`;
	const {StartX, StartY, EndX, EndY} = gradientData;

	const onDrag = (o) => {
		if (!onPointMove) {
			return null;
		}
		const movingId = o.srcElement.parentElement.getAttribute('id');
		switch (movingId) {
		case 'point-S': 
			onPointMove({StartX: o.offsetX / width, StartY: o.offsetY / height});
			break;
		case 'point-E':
			onPointMove({EndX: o.offsetX / width, EndY: o.offsetY / height});
			break;
		default:
			break;
		}
	};

	return (
		<div className="palette" style={{ width, height }}>
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox={`0 0 ${height} ${width}`} enableBackground={`new 0 0 ${height} ${width}`} xmlSpace="preserve" {...{ width, height }} id="draggable-container">
				{getGradientDef(gradientId, gradientData)}
				<rect x="0" y="0" width="100%" height="100%" fill={ gradientUrl }/>
				{[{x: StartX, y: StartY, text: 'S'}, {x: EndX, y: EndY, text: 'E'}].map(point => {
					return (
						<DraggableCircle
							key={`point-${point.text}`} 
							id={`point-${point.text}`} 
							containerId="draggable-container"
							{...{onDrag}}
							transform={`matrix(1,0,0,1,${point.x*width},${point.y*height})`}
						>
							<circle
								fill='black'
								r={ 8 } />
							<text
								x={-4} 
								y={4} 
								fill="white">
								{point.text}
							</text>
						</DraggableCircle>
					);
				})}
			</svg>
		</div>
	);
};

Palette.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	gradientData: PropTypes.object.isRequired,
	onPointMove: PropTypes.func,
	palette: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
			pos: PropTypes.number.isRequired
		}).isRequired
	).isRequired
};

export default Palette;
