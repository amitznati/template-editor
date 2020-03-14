import React from 'react';

function Quadratic(props) {
	const {
		x,
		y,
		p1x,
		p1y,
		p2x,
		p2y,
		t,
		index,
		drag,
		scale
	} = props;

	let anchor = (<g />);

	if (! t) {
		anchor = (
			<g className="ad-Anchor">
				<line
					className="ad-Anchor-line"
					x1={ p1x }
					y1={ p1y }
					x2={ x }
					style={{strokeWidth: 1 / scale}}
					y2={ y } />

				<line
					className="ad-Anchor-line"
					style={{strokeWidth: 1 / scale}}
					x1={ x }
					y1={ y }
					x2={ p2x }
					y2={ p2y } />

				<circle
					className="ad-Anchor-point"
					style={{strokeWidth: 4 / scale}}
					onMouseDown={ (e) => drag(e, index, 'quadratic') }
					cx={ x }
					cy={ y }
					r={ 6 / scale } />
			</g>
		);
	}

	return anchor;
}

export default Quadratic;
