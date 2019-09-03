import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Grid from './Grid';
import Point from './Point';
import Cubic from './Cubic';
import Quadratic from './Quadratic';
import {getPX} from '../../../../utils';
// import './styles.css';

class SVG extends Component {
	static propTypes = {
		w: PropTypes.number.isRequired,
		h: PropTypes.number.isRequired,
		path: PropTypes.string.isRequired,
		grid: PropTypes.object.isRequired,
		points: PropTypes.array.isRequired,
		activePoint: PropTypes.number.isRequired,
		fillPath: PropTypes.bool.isRequired,
		addPoint: PropTypes.func.isRequired,
		drag: PropTypes.func.isRequired,
		handleMouseMove: PropTypes.func.isRequired,
		propRef: PropTypes.object.isRequired,
		layout: PropTypes.object.isRequired,
		scale: PropTypes.number.isRequired
	}

	render() {
		const {
			w,
			h,
			path,
			grid,
			points,
			activePoint,
			fillPath,
			addPoint,
			drag,
			handleMouseMove,
			scale,
			layout: {properties: {x, y, scaleX, scaleY, rotation}}
		} = this.props;
		const lx = getPX(x);
		const ly = getPX(y);
		const translateX = scaleX > 1 ? (lx/scaleX) - lx : 0;
		const translateY = scaleY > 1 ? (ly/scaleY) - ly : 0;
		let circles = points.map((point, index, _points) => {
			let anchors = [],
				previous = false;

			if (index !== 0) {
				previous = _points[index - 1];
			}

			if (point.quadratic) {
				anchors.push(
					<Quadratic
						key={ `q_${ index }` }
						index={ index }
						p1x={ previous.x  }
						p1y={ previous.y  }
						p2x={ point.x  }
						p2y={ point.y  }
						x={ point.quadratic.x  }
						y={ point.quadratic.y  }
						t={ previous.quadratic && point.quadratic.t }
						drag={ drag } />
				);
			} else if (point.cubic) {
				anchors.push(
					<Cubic
						key={ `c_${ index }` }
						index={ index }
						p1x={ previous.x }
						p1y={ previous.y }
						p2x={ point.x  }
						p2y={ point.y  }
						x1={ point.cubic.x1  }
						y1={ point.cubic.y1  }
						x2={ point.cubic.x2  }
						y2={ point.cubic.y2  }
						s={ previous.cubic && point.cubic.s }
						drag={ drag } />
				);
			}

			return (
				<g
					key={ index }
					className={ cx('ad-PointGroup', {
						'ad-PointGroup--first': (index === 0),
						'is-active': (activePoint === index),
					}) }
				>
					<Point
						index={ index }
						x={ point.x }
						y={ point.y }
						drag={ drag } />

					{ anchors }
				</g>
			);
		});

		return (
			<svg
				ref={this.props.propRef}
				className="ad-SVG"
				width={ w }
				height={ h }
				onClick={ addPoint }
				onMouseMove={ handleMouseMove }>
				<Grid
					w={ w }
					h={ h }
					grid={ grid } />
				<g 
					transform={`
					scale(${scale * scaleX} ${scale * scaleY}) 
					translate(${lx + translateX} ${ly + translateY})
					rotate(${rotation})
					`} >
					<path 
						className={ cx('ad-Path', { 'ad-Path--filled': fillPath }) }
						d={ path } />
					<g className="ad-Points">
						{ circles }
					</g>
				</g>
				
			</svg>
		);
	}
}

export default SVG;
