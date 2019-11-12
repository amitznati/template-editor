import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { Grid, ClickAwayListener } from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup}  from '@material-ui/lab';
import {GradientBuilder, CoreNumber} from './../components/core';

const styles = {
	popover: {
		position: 'absolute',
		zIndex: '2'
	},
	cover: {
		position: 'fixed',
		top: '0px',
		right: '0px',
		bottom: '0px',
		left: '0px',
	},
};

// eslint-disable-next-line react/prop-types
const getRgba = (rgba) => {
	return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
};

// eslint-disable-next-line react/prop-types
const WrappedSketchPicker = ({ onSelect, ...rest }) => {
	if (rest && rest.isActive) {
		return (
			<div style={ styles.popover }>
				<SketchPicker { ...rest } onChange={ c => onSelect(getRgba(c.rgb))} />
			</div>
		);
	}
	return '';
};


class GradientPicker extends React.Component {
	constructor(props){
		super(props);
		this.gradientRef = React.createRef();
	}
	componentDidMount(){
		const {onPaletteChange, gradientData} = this.props;
		if (onPaletteChange) {
			onPaletteChange(gradientData);
		}
	}

	handleAngleChange = (angle) => {
		const {gradientData: {StartX: cx, StartY: cy, EndX, EndY}} = this.props;
		const p = {x: EndX, y: EndY};
		const c = Math.cos(angle * Math.PI / 180.0);
		const s = Math.sin(angle * Math.PI / 180.0);
		p.x -= cx;
		p.y -= cy;

		// rotate point
		const xnew = p.x * c - p.y * s;
		const ynew = p.x * s + p.y * c;

		// translate point back:
		p.x = xnew + cx;
		p.y = ynew + cy;
		return {
			Angle: angle,
			EndX: p.x,
			EndY: p.y
		};
	};

	handleChange = (values) => {
		const {onPaletteChange, gradientData} = this.props;
		let newValues = values;
		if (values.Angle) {
			newValues = this.handleAngleChange(values.Angle);
		}
		if (onPaletteChange) {
			onPaletteChange({...gradientData, ...newValues});
		}
	};

	render() {
		const {gradientData} = this.props;
		const {palette, activeId, isActive, gradientType} = gradientData;
		return (
			<div ref={this.gradientRef}>
				<Grid container style={{margin: '15px 0'}}>
					<Grid item xs={12}>
						<ToggleButtonGroup size="medium"
							exclusive
							value={gradientType}
							onChange={(event, gradientType) =>this.handleChange({gradientType})}>
							<ToggleButton value="Linear">
							Linear
								<i className="material-icons">
								linear_scale
								</i>
							</ToggleButton>
							<ToggleButton value="Radial">
								Radial
								<i className="material-icons">
									all_out
								</i>
							</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
				<ClickAwayListener onClickAway={() => this.handleChange({isActive: false})}>
					<GradientBuilder {...{
						width: 250,
						height: 250,
						palette,
						activeId,
						gradientData,
						onPaletteChange: (palette) => this.handleChange({palette}),
						onStepClick: (activeId) => this.handleChange({isActive: true, activeId}),
						onPointMove: (newVal) => this.handleChange(newVal)
					}}>
						<WrappedSketchPicker 
							{...{
								width: 200,
								disableAlpha: false,
								isActive: isActive,
							}} 
						/>
					</GradientBuilder>
				</ClickAwayListener>
				
				<ClickAwayListener onClickAway={() => this.handleChange({gradientPointsOnFocus: false})}>
					<Grid container>
						{['StartX', 'StartY', 'EndX', 'EndY'].map(name => {
							return (
								<Grid item md={3} key={name}>
									<CoreNumber 
										type="number" 
										label={name}
										inputProps={{ min: '0', max: '1', step: '0.01' }}
										margin="normal"
										value={gradientData[name]} 
										onChange={(v) => this.handleChange({[name]: v})}
										onFocus={() => this.handleChange({gradientPointsOnFocus: true})}
									/>
								</Grid>
							);
						})}
						{gradientType === 'Radial' && 
							['Angle', 'EndRadius'].map(name => {
								return (
									<Grid item md={3} key={name}>
										<CoreNumber
											type="number"
											label={name}
											inputProps={{step: '0.1' }}
											value={gradientData[name]}
											onChange={(v) => this.handleChange({[name]: v < 0 ? 0 : v})}
											onFocus={() => this.handleChange({gradientPointsOnFocus: true})}
										/>
									</Grid>
								);
							})
						}
					</Grid>
				</ClickAwayListener>
			</div>
			
		);
	}
}

GradientPicker.propTypes = {
	onPaletteChange: PropTypes.func.isRequired,
	gradientData: PropTypes.object
};

GradientPicker.defaultProps = {
	gradientData: {
		gradientType: 'Linear',
		StartX: 0.5,
		StartY: 0.5,
		EndX: 0.5,
		EndY: 0.1,
		palette: [
			{ pos: 0, color: 'rgba(255,0,18,1)' },
			{ pos: 1, color: 'rgba(30,0,255,1)' }
		],
		activeId: 1,
		isActive: false,
		gradientPointsOnFocus: false,
		Angle: 0,
		EndRadius: 0.5
	}
};


export default GradientPicker;