import React from 'react';
import PropTypes from 'prop-types';
import {getGradientDef} from './index';
import './Palette.css';

const Palette = ({  width, height, gradientData }) => {
	// const compare = ({ pos: pos1 }, { pos: pos2 }) => pos1 - pos2;
	//const sortedPalette = [...palette].sort(compare);
	const gradientId = '_' + Math.random().toString(36).substr(2, 9);
	const gradientUrl = `url(#${gradientId})`;
	const {StartX, StartY, EndX, EndY} = gradientData;
	return (
		<div className="palette" style={{ width, height }}>
			<svg width="100%" height="100%">
				{getGradientDef(gradientId, gradientData)}
				<rect x="0" y="0" width="100%" height="100%" fill={ gradientUrl }/>
				{[{x: StartX, y: StartY, text: 'S'}, {x: EndX, y: EndY, text: 'E'}].map(point => {
					return (
						<g key={`point-${point.text}`}>
							<circle
								// onMouseDown={ (e) => drag(e, index) }
								cx={ `${point.x * 100}%` }
								cy={ `${point.y * 100}%` }
								fill='black'
								r={ 8 } />
							<text x={`${(point.x * 100) - 2}%`} y={`${(point.y * 100) + 1.5}%`} fill="white">{point.text}</text>
						</g>
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
	palette: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
			pos: PropTypes.number.isRequired
		}).isRequired
	).isRequired
};

export default Palette;
