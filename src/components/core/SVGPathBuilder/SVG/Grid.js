/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';

function Grid(props) {
	const {
		w,
		h,
		grid,
	} = props;

	let _grid = [];

	// vertical lines
	const spacing = w / grid.size;
	for (let i = 1 ; i < grid.size ; i++) {
		_grid.push(
			<line
				key={ `v_${i}` }
				x1={ i * spacing }
				y1={ 0 }
				x2={ i * spacing }
				y2={ h } />
		);
	}
	// // vertical lines
	// for (let i = 1 ; i < (w / grid.size) ; i++) {
	// 	_grid.push(
	// 		<line
	// 			key={ `v_${i}` }
	// 			x1={ i * grid.size }
	// 			y1={ 0 }
	// 			x2={ i * grid.size }
	// 			y2={ h } />
	// 	);
	// }

	// horizontal lines
	for (let i = 1 ; (i * spacing) < h ; i++) {
		_grid.push(
			<line
				key={ `h_${i}` }
				x1={ 0 }
				y1={ i * spacing }
				x2={ w }
				y2={ i * spacing} />
		);
	}

	return (
		<g className={ cx('ad-Grid', { 'is-hidden': !grid.show }) }>
			{ _grid }
		</g>
	);
}

export default Grid;
