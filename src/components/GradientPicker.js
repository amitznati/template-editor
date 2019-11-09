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
		const {gradientData: {EndRadius, StartX, StartY}} = this.props;
		return {
			Angle: angle,
			EndX: StartX + (Math.cos(angle * Math.PI / 180.0))*(EndRadius-5),
			EndY: StartY + (Math.sin(angle * Math.PI / 180.0))*(EndRadius-5)
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
				<ClickAwayListener onClickAway={() => this.handleChange({isActive: false})}>
					<GradientBuilder {...{
						width: 250,
						height: 32,
						palette,
						activeId,
						onPaletteChange: (palette) => this.handleChange({palette}),
						onStepClick: (activeId) => this.handleChange({isActive: true, activeId})
					}}>
						<WrappedSketchPicker {...{
							width: 200,
							disableAlpha: false,
							isActive: isActive,
						}} />
					</GradientBuilder>
				</ClickAwayListener>
				<Grid container style={{margin: '15px 0'}}>
					<Grid item>
						<ToggleButtonGroup size="large"
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
				<ClickAwayListener onClickAway={() => this.handleChange({gradientPointsOnFocus: false})}>
					<Grid container>
						{['StartX', 'StartY', 'EndX', 'EndY'].map(name => {
							return (
								<Grid item md={3} key={name}>
									<CoreNumber 
										type="number" 
										label={name} 
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
		StartX: 50,
		StartY: 50,
		EndX: 50,
		EndY: 50,
		palette: [
			{ pos: 0, color: 'rgba(255,0,18,1)' },
			{ pos: 1, color: 'rgba(30,0,255,1)' }
		],
		activeId: 1,
		isActive: false,
		gradientPointsOnFocus: false,
		Angle: 0,
		EndRadius: 50
	}
};


export default GradientPicker;