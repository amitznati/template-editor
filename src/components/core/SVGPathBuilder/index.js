import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Drawer} from '@material-ui/core';

import { positive, rangeGrid } from './utils/maths';
import { L, Q, C, A } from './utils/points';
import { getPath } from './utils/path';

import SVG from './SVG';
import Controls from './Controls';



import './Builder/styles.css';
import { getPX } from '../../../utils';

class SVGPathBuilder extends Component {
	static propTypes = {
		initialPoints: PropTypes.array.isRequired,
		h: PropTypes.number.isRequired,
		w: PropTypes.number.isRequired,
		gridSize: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		layout: PropTypes.object.isRequired,
		scale: PropTypes.number
	}
	
	constructor(props) {
		super(props);
		this.svg = React.createRef();
		this.portalRef = React.createRef();
		this.state = {
			ctrl: false,
			activePoint: 0,
			isDragging: false,
			fillPath: false,
			grid: {
				show: true,
				snap: false,
				size: props.gridSize,
			},
			points: props.initialPoints,
			closePath: false,
			path: this.handlePathChange(props.initialPoints, false)
		};
	}

	
	

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown, false);
		document.addEventListener('keyup', this.handleKeyUp, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown, false);
		document.removeEventListener('keyup', this.handleKeyUp, false);
	}

	handleChange = (newValues) => {
		this.setState(newValues);
	}

	handlePathChange = (points, closePath) => {
		const {onChange} = this.props;
		const path = getPath(points,closePath);
		if(onChange) {
			onChange({points, path});
		}
		return path;
	}

	handleKeyDown = (e) => {
		if (e.ctrlKey || e.metaKey) {
			this.handleChange({ ctrl: true });
		}
	}

	handleKeyUp = (e) => {
		if ( ! e.ctrlKey && ! e.metaKey) {
			this.handleChange({ ctrl: false });
		}
	}

	/**
	 * SVG document parameters
	 */
	setWidth = (e) => {
		let v = positive(e.target.value),
			min = 1;

		if (v < min) {
			v = min;
		}

		this.handleChange({ w: v });
	}

	setHeight = (e) => {
		let v = positive(e.target.value),
			min = 1;

		if (v < min) {
			v = min;
		}

		this.handleChange({ h: v });
	}

	/**
	 * Path parameters
	 */
	setClosePath = (e) => {
		const { points } = this.state,
			closePath = e.target.checked;

		this.handleChange({
			closePath,
			path: this.handlePathChange(points, closePath),
		});
	}

	setFillPath = (e) => {
		this.handleChange({ fillPath: e.target.checked });
	}

	/**
	 * Grid parameters
	 */
	setGridSize = (e) => {
		let grid = this.state.grid;

		grid.size = rangeGrid(positive(e.target.value), 1, Math.min(this.props.w, this.props.h));

		this.handleChange({ grid });
	}

	setGridSnap = (e) => {
		let grid = this.state.grid;

		grid.snap = e.target.checked;

		this.handleChange({ grid });
	}

	setGridShow = (e) => {
		let grid = this.state.grid;

		grid.show = e.target.checked;

		this.handleChange({ grid });
	}

	getMouseCoords = (e) => {
		const {w, scale, layout: {properties: {transform: {translateX: lx = 0, translateY: ly = 0, scaleX = 1, scaleY = 1}}}} = this.props;
		const { left, top } = this.svg.current.getBoundingClientRect(),
			{ grid: {size, snap}} = this.state;
		const spacing = w / size;
		const calcLX = getPX(lx);
		const calcLY = getPX(ly);
		//const translateX = scaleX > 1 ? (calcLX/scaleX) + calcLX : calcLX;
		let x = Math.round(e.pageX - left),
			y = Math.round(e.pageY - top);
		
		if (snap) {
			x = spacing * Math.round(x / spacing);
			y = spacing * Math.round(y / spacing);
		}
		return { x: (x/(scale) - calcLX)/scaleX, y: (y/scale - calcLY)/scaleY  };
	}

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
	}

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

			this.handleChange({
				points,
				path: this.handlePathChange(points, closePath),
			});
		}
	}

	setPointPosition = (coord, e) => {
		let coords = this.state.points[this.state.activePoint],
			v = positive(e.target.value);

		if (coord === 'x' && v > this.props.w) {
			v = this.props.w;
		} else if (coord === 'y' && v > this.props.h) {
			v = this.props.h;
		}

		coords[coord] = v;

		this.setPointCoords(coords);
	}

	setPointCoords = (coords) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].x = coords.x;
		points[activePoint].y = coords.y;

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

	setQuadraticPosition = (coord, e) => {
		let coords = this.state.points[this.state.activePoint].quadratic,
			v = positive(e.target.value);

		if (coord === 'x' && v > this.props.w) {
			v = this.props.w;
		} else if (coord === 'y' && v > this.props.h) {
			v = this.props.h;
		}

		coords[coord] = v;

		this.setQuadraticCoords(coords);
	}

	setQuadraticCoords = (coords) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].quadratic.x = coords.x;
		points[activePoint].quadratic.y = coords.y;

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

	setQuadraticT = (e) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].quadratic.t = e.target.checked;

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

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
	}

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

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

	setCubicS = (e) => {
		const { points, activePoint, closePath } = this.state;

		points[activePoint].cubic.s = e.target.checked;

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

	setArcParam = (param, e) => {
		const { points, activePoint, closePath } = this.state;

		let v;

		if (['laf', 'sf'].indexOf(param) > -1) {
			v = e.target.checked ? 1 : 0;
		} else {
			v = positive(e.target.value);
		}

		points[activePoint].arc[param] = v;

		this.handleChange({
			points,
			path: this.handlePathChange(points, closePath),
		});
	}

	drag = (e, index, object = 'point', n = false) => {
		e.preventDefault();

		if ( ! this.state.ctrl) {
			const newState = {
				activePoint: index,
				isDragging: { object, n },
			};
			this.handleChange({
				...newState
			});
		}
	}

	cancelDragging = () => {
		this.handleChange({ isDragging: false });
	}

	addPoint = (e) => {
		if (this.state.ctrl) {
			const coords = this.getMouseCoords(e),
				{ points, closePath } = this.state;

			points.push(coords);

			const path = this.handlePathChange(points, closePath);
			const newState = {
				points,
				path,
				activePoint: points.length - 1,
			};

			this.handleChange({
				...newState
			});
		}
	}

	removeActivePoint = () => {
		let { points, activePoint, closePath } = this.state;

		if (points.length > 1 && activePoint !== 0) {
			points = this.resetNextCurve(points, activePoint);
			points.splice(activePoint, 1);

			this.handleChange({
				points,
				path: this.handlePathChange(points, closePath),
				activePoint: points.length - 1,
			});
		}
	}

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
	}

	reset = () => {
		const { w, h } = this.state,
			points = [{ x: w / 2, y: h / 2 }],
			closePath = false,
			path = this.handlePathChange(points, closePath);

		this.handleChange({
			points,
			path,
			closePath,
			activePoint: 0,
		});
	}

	render() {
		if (!this.state.path) return null;
		return (
			<div
				className="ad-Builder--"
				onMouseUp={ this.cancelDragging }
			>
				<SVG
					propRef={this.svg}
					{ ...this.state }
					w={this.props.w/this.props.scale}
					h={this.props.h/this.props.scale}
					scale={this.props.scale}
					layout={this.props.layout}
					drag={ this.drag }
					addPoint={ this.addPoint }
					handleMouseMove={ this.handleMouseMove } />

				
				
				<Drawer
					variant="persistent"
					anchor="right"
					open
				>
					<div className="ad-Builder-controls">
						<Controls
							{ ...this.state }
							w={this.props.w}
							h={this.props.h}
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
				</Drawer>
			</div>
		);
	}
}

export default SVGPathBuilder;