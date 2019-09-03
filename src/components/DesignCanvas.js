
import React from 'react';
import PropTypes from 'prop-types';

class DesignCanvas extends React.Component {
	render() {
		const {h, w, scale} = this.props;
		return (
			<svg id="svg-container" viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink" >
				{this.props.children}
			</svg>
		);
	}
}

DesignCanvas.propTypes = {
	children: PropTypes.array,
	onUpdateNode: PropTypes.func,
	onLayoutClick: PropTypes.func,
	onEditLayoutEnd: PropTypes.func,
	selectedLayoutIndex: PropTypes.any,
	h: PropTypes.number,
	w: PropTypes.number,
	scale: PropTypes.number,
	layout: PropTypes.array
};

export default DesignCanvas;