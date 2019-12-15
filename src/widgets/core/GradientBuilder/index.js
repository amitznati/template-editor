import React from 'react';
import PropTypes from 'prop-types';
import ColorStopsHolder from './ColorStopsHolder';
import Palette from './Palette';
import ColorPicker from './ColorPicker';

const HALF_STOP_WIDTH = 5;

const toState = (palette, activeId) => ({
	palette: palette.map((c, i) => ({	id: i + 1, ...c })),
	activeId: activeId,
	pointX: null
});

const fromState = (palette) => {
	const compare = ({ pos: pos1 }, { pos: pos2 }) => pos1 - pos2;
	const sortedPalette = palette.sort(compare);
	return sortedPalette.map(({ pos, color }) => ({ pos: pos.toPrecision(3), color }));
};

export const getGradientDef = (id, gradientData) => {
	const {gradientType, EndY, EndX, StartX, StartY, EndRadius, palette, spreadMethod} = gradientData;
	const stops = palette.map((point, index) => {
		return <stop key={`stop-${index}`} offset={point.pos} stopColor={point.color} />;
	});
	let shape = '';
	switch (gradientType) {
	case 'Linear': {
		shape = (
			<linearGradient spreadMethod={spreadMethod} id={ id } x1={StartX} y1={StartY} x2={EndX} y2={EndY}> 
				{stops}	
			</linearGradient>
		);
		break;
	}
	case 'Radial': {
		shape = (
			<radialGradient spreadMethod={spreadMethod} id={id} cx={StartX} cy={StartY} r={EndRadius} fx={EndX} fy={EndY}>
				{stops}
			</radialGradient>
		);
		break;
	}
	default: 
		return '';
	}

	return (
		<defs key={id}>
			{shape}
		</defs>
	);
};

class GradientBuilder extends React.Component {
	constructor (props) {
		super(props);
		this.state = { ...toState(props.palette, props.activeId) };
		this.handlePosChange = this.handlePosChange.bind(this);
		this.handleAddColor = this.handleAddColor.bind(this);
		this.handleActivate = this.handleActivate.bind(this);
		this.handleDeleteColor = this.handleDeleteColor.bind(this);
		this.handleSelectColor = this.handleSelectColor.bind(this);
	}

	get width1 () {
		return this.props.width + 1;
	}

	get nextId () {
		return Math.max(...this.state.palette.map(c => c.id)) + 1;
	}

	get activeStop () {
		return this.state.palette.find(s => s.id === this.state.activeId);
	}

	get mapStateToStops () {
		const activeId = this.state.activeId;
		const pointX = this.state.pointX;
		return this.state.palette.map(c => ({
			...c,
			pos: this.width1 * c.pos - HALF_STOP_WIDTH,
			isActive: c.id === activeId,
			pointX
		}));
	}

	get colorPicker () {
		// eslint-disable-next-line react/prop-types
		const { children } = this.props;
		const props = {
			color: this.activeStop.color,
			onSelect: this.handleSelectColor
		};
		if (!children) {
			return <ColorPicker { ...props } />;
		}
		const child = React.Children.only(children);
		return React.cloneElement(child, props);
	}

	notifyChange (palette) {
		this.props.onPaletteChange(fromState(palette));
	}

	handleActivate (activeId) {
		this.setState({ activeId });
		if (this.props.onStepClick) {
			this.props.onStepClick(activeId);
		}
	}

	handleDeleteColor (id) {
		if (this.state.palette.length < 3) return;
		const palette = this.state.palette.filter(c => c.id !== id);
		const activeId = palette.reduce((a, x) => x.pos < a.pos ? x : a, palette[0]).id;
		this.setState({ palette, activeId });
		this.notifyChange(palette);
	}

	handlePosChange ({ id, pos }) {
		const palette = this.state.palette.map(c =>
			id === c.id ? { ...c, pos: (pos + HALF_STOP_WIDTH) / this.width1 } : { ...c }
		);
		this.setState({ palette });
		this.notifyChange(palette);
	}

	handleAddColor ({ pos, pointX }) {
		const color = this.activeStop.color;
		const entry = { id: this.nextId, pos: pos / this.width1, color };
		const palette = [...this.state.palette, entry];
		this.setState({ palette, pointX });
		this.notifyChange(palette);
	}

	handleSelectColor (color) {
		let { palette, activeId } =	this.state;
		palette = palette.map(c =>
			activeId === c.id ? { ...c, color } : { ...c }
		);
		this.setState({ palette });
		this.notifyChange(palette);
	}

	componentDidUpdate ({ palette: prev, activeId }) {
		const { palette: current } = this.props;
		if (prev.length === current.length) return; 
		const length = Math.min(prev.length, current.length);
		for (let i = 0; i < length; i++) {
			if (prev[i].pos !== current[i].pos || prev[i].color !== current[i].color) {
				this.setState({ ...toState(current, activeId) });
				return;
			}
		}
	}

	render () {
		const { width, height, drop, gradientData, onPointMove } = this.props;
		const {palette} = this.state;
		const min = -HALF_STOP_WIDTH;
		const max = this.width1 - HALF_STOP_WIDTH;
		return (
			<div>
				<Palette {...{ width, height, palette, gradientData, onPointMove }} />
				<ColorStopsHolder
					width={ width }
					stops={ this.mapStateToStops }
					limits={{ min, max, drop }}
					onPosChange={ this.handlePosChange }
					onAddColor={ this.handleAddColor }
					onActivate={ this.handleActivate }
					onDeleteColor={ this.handleDeleteColor }
				/>
				{ this.colorPicker }
			</div>
		);
	}
}

GradientBuilder.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	drop: PropTypes.number,
	gradientData: PropTypes.object,
	onPointMove: PropTypes.func,
	palette: PropTypes.arrayOf(
		PropTypes.shape({
			pos: PropTypes.number,
			color: PropTypes.string
		}).isRequired
	),
	onPaletteChange: PropTypes.func.isRequired,
	onStepClick: PropTypes.func,
	activeId: PropTypes.number
};

GradientBuilder.defaultProps = {
	width: 400,
	height: 32,
	drop: 50,
	gradientData: {
		StartX: 0, StartY: 0, EndX: 1, EndY: 0,
		Radius: 0.5
	},
	palette: [
		{ pos: 0, color: '#9adafa' },
		{ pos: 1, color: 'rgba(241,57,70,1)' }
	],
	activeId: 1
};

export default GradientBuilder;
