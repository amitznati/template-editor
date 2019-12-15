import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SVG from '../SVG';
import Controls from '../Controls';
// import Foot from './Foot';

import { positive, rangeGrid } from './../utils/maths';
import { L, Q, C, A } from './../utils/points';
import { getPath } from './../utils/path';

import './styles.css';

class Builder extends Component {
	static propTypes = {
		initialPoints: PropTypes.array.isRequired,
		initialClosePath: PropTypes.bool.isRequired,
		onChange: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.svg = React.createRef();
	}

	state = {
		w: 1000,
		h: 800,
		ctrl: false,
		activePoint: 0,
		isDragging: false,
		fillPath: false,
		grid: {
			show: true,
			snap: true,
			size: 20,
		},
		points: this.props.initialPoints,
		closePath: this.props.initialClosePath,
		path: getPath(this.props.initialPoints, this.props.initialClosePath),
	};

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown, false);
		document.addEventListener('keyup', this.handleKeyUp, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown, false);
		document.removeEventListener('keyup', this.handleKeyUp, false);
	}

	handleKeyDown = (e) => {
		if (e.ctrlKey || e.metaKey) {
			this.setState({ ctrl: true });
		}
	};

	handleKeyUp = (e) => {
		if ( ! e.ctrlKey && ! e.metaKey) {
			this.setState({ ctrl: false });
		}
	};

	/**
	 * SVG document parameters
	 */
	setWidth = (e) => {
		let v = positive(e.target.value),
			min = 1;

		if (v < min) {
			v = min;
		}

		this.setState({ w: v });
	};

	setHeight = (e) => {
		let v = positive(e.target.value),
			min = 1;

		if (v < min) {
			v = min;
		}

		this.setState({ h: v });
	};

	/**
	 * Path parameters
	 */
	setClosePath = (e) => {
		const { points } = this.state,
			closePath = e.target.checked;

		this.setState({
			closePath,
			path: getPath(points, closePath),
		});
	};

	setFillPath = (e) => {
		this.setState({ fillPath: e.target.checked });
	};

	/**
	 * Grid parameters
	 */
	setGridSize = (e) => {
		let grid = this.state.grid;

		grid.size = rangeGrid(positive(e.target.value), 1, Math.min(this.state.w, this.state.h));

		this.setState({ grid });
	};

	setGridSnap = (e) => {
		let grid = this.state.grid;

		grid.snap = e.target.checked;

		this.setState({ grid });
	};

	setGridShow = (e) => {
		let grid = this.state.grid;

		grid.show = e.target.checked;

		this.setState({ grid });
	};

	getMouseCoords = (e) => {
		const { left, top } = this.svg.current.getBoundingClientRect(),
			{ size, snap } = this.state.grid;

		let x = Math.round(e.pageX - left),
			y = Math.round(e.pageY - top);

		if (snap) {
			x = size * Math.round(x / size);
			y = size * Math.round(y / size);
		}

		return { x, y };
	};

	resetNextCurve = (points, active) => {
		if (active !== points.length - 1) {
			if (points[active + 1].quadratic) {
				points[active + 1].quadratic.t = false;
			}

			if (points[active + 1].cubic) {
				points[active + 1].cubic.s = false;
			}
		}

		return points;
	};

	/**
	 * Default point values
	 */
	setPointType = (e) => {
		let { points, activePoint, closePath } = this.state;

		// not the first point
		if (activePoint !== 0) {
			let v = e.target.value;

			points = this.resetNextCurve(points, activePoint);

			let p = points[activePoint],
				_p = points[activePoint - 1];

			switch (v) {
			case 'l':
				points[activePoint] = L(p.x, p.y);
				break;

			case 'q':
				points[activePoint] = Q(p.x, p.y, (p.x + _p.x) / 2, (p.y + _p.y) / 2);
				break;

			case 'c':
				points[activePoint] = C(p.x, p.y, (p.x + _p.x - 50) / 2, (p.y + _p.y) / 2, (p.x + _p.x + 50) / 2, (p.y + _p.y) / 2);
				break;

			case 'a':
				points[activePoint] = A(p.x, p.y, 50, 50, 0, 1, 1);
				break;
			default:
				break;
			}

			this.setState({
				points,
				path: getPath(points, closePath),
			});
		}
	};

	setPointPosition = (coord, e) => {
		let coords = this.state.points[this.state.activePoint],
			v = positive(e.target.value);

		if (coord === 'x' && v > this.state.w) {
			v = this.state.w;
		} else if (coord === 'y' && v > this.state.h) {
			v = this.state.h;
		}

		coords[coord] = v;

		this.setPointCoords(coords);
	};

	setPointCoords = (coords) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].x = coords.x;
		points[activePoint].y = coords.y;

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	setQuadraticPosition = (coord, e) => {
		let coords = this.state.points[this.state.activePoint].quadratic,
			v = positive(e.target.value);

		if (coord === 'x' && v > this.state.w) {
			v = this.state.w;
		} else if (coord === 'y' && v > this.state.h) {
			v = this.state.h;
		}

		coords[coord] = v;

		this.setQuadraticCoords(coords);
	};

	setQuadraticCoords = (coords) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].quadratic.x = coords.x;
		points[activePoint].quadratic.y = coords.y;

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	setQuadraticT = (e) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].quadratic.t = e.target.checked;

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	setCubicPosition = (coord, e) => {
		let coords = this.state.points[this.state.activePoint].cubic;
		let	v = positive(e.target.value);

		if (coord === 'x1') {
			this.setCubicCoords({
				x: v,
				y: coords.y1,
			}, 1);
		}

		if (coord === 'y1') {
			this.setCubicCoords({
				x: coords.x1,
				y: v,
			}, 1);
		}

		if (coord === 'x2') {
			this.setCubicCoords({
				x: v,
				y: coords.y2,
			}, 2);
		}

		if (coord === 'y2') {
			this.setCubicCoords({
				x: coords.x2,
				y: v,
			}, 2);
		}
	};

	setCubicCoords = (coords, n) => {
		const { points, activePoint, closePath } = this.state;

		if (n === 1) {
			points[activePoint].cubic.x1 = coords.x;
			points[activePoint].cubic.y1 = coords.y;
		}

		if (n === 2) {
			points[activePoint].cubic.x2 = coords.x;
			points[activePoint].cubic.y2 = coords.y;
		}

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	setCubicS = (e) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].cubic.s = e.target.checked;

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	setArcParam = (param, e) => {
		const { points, activePoint, closePath } = this.state;

		let v;

		if (['laf', 'sf'].indexOf(param) > -1) {
			v = e.target.checked ? 1 : 0;
		} else {
			v = positive(e.target.value);
		}

		points[activePoint].arc[param] = v;

		this.setState({
			points,
			path: getPath(points, closePath),
		});
	};

	drag = (e, index, object = 'point', n = false) => {
		e.preventDefault();

		if ( ! this.state.ctrl) {
			const newState = {
				activePoint: index,
				isDragging: { object, n },
			};
			this.setState({
				...newState
			});
		}
	};

	cancelDragging = () => {
		this.setState({ isDragging: false });
	};

	addPoint = (e) => {
		if (this.state.ctrl) {
			const coords = this.getMouseCoords(e),
				{ points, closePath } = this.state;

			points.push(coords);

			const path = getPath(points, closePath);
			const newState = {
				points,
				path,
				activePoint: points.length - 1,
			};

			this.setState({
				...newState
			});
		}
	};

	removeActivePoint = () => {
		let { points, activePoint, closePath } = this.state;

		if (points.length > 1 && activePoint !== 0) {
			points = this.resetNextCurve(points, activePoint);
			points.splice(activePoint, 1);

			this.setState({
				points,
				path: getPath(points, closePath),
				activePoint: points.length - 1,
			});
		}
	};

	handleMouseMove = (e) => {
		e.preventDefault();

		if ( ! this.state.ctrl) {
			let { object, n } = this.state.isDragging;

			switch (object) {
			case 'point':
				this.setPointCoords(this.getMouseCoords(e));
				break;

			case 'quadratic':
				this.setQuadraticCoords(this.getMouseCoords(e));
				break;

			case 'cubic':
				this.setCubicCoords(this.getMouseCoords(e), n);
				break;
			default:
				break;
			}
		}
	};

	reset = () => {
		const { w, h } = this.state,
			points = [{ x: w / 2, y: h / 2 }],
			closePath = false,
			path = getPath(points, closePath);

		this.setState({
			points,
			path,
			closePath,
			activePoint: 0,
		});
	};

	render() {
		return (
			<div
				className="ad-Builder"
				onMouseUp={ this.cancelDragging }>
				<div className="ad-Builder-main">
					<div className="ad-Builder-svg">
						<SVG
							propRef={this.svg}
							{ ...this.state }
							drag={ this.drag }
							addPoint={ this.addPoint }
							handleMouseMove={ this.handleMouseMove } />
					</div>

					{/* <Foot /> */}
				</div>

				<div className="ad-Builder-controls">
					<Controls
						{ ...this.state }
						reset={ this.reset }
						removeActivePoint={ this.removeActivePoint }
						setPointPosition={ this.setPointPosition }
						setQuadraticPosition={ this.setQuadraticPosition }
						setQuadraticT={ this.setQuadraticT }
						setCubicPosition={ this.setCubicPosition }
						setCubicS={ this.setCubicS }
						setArcParam={ this.setArcParam }
						setPointType={ this.setPointType }
						setWidth={ this.setWidth }
						setHeight={ this.setHeight }
						setGridSize={ this.setGridSize }
						setGridSnap={ this.setGridSnap }
						setGridShow={ this.setGridShow }
						setClosePath={ this.setClosePath }
						setFillPath={ this.setFillPath } />
				</div>
			</div>
		);
	}
}

export default Builder;
