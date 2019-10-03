import React from 'react';
import {Grid, Button, Typography} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup}  from '@material-ui/lab';
import { CoreColorPicker } from '../core';
import GradientPicker from '../GradientPicker';

export default class ColorProperties extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			colorPickerOpen: false
		}
	}
	handleColorOpen = (e) => {
		this.setState({anchorEl: e.currentTarget});
	};

	handleColorClose = () => {
		this.setState({anchorEl: null});
	};

	handleFillColorChange = (color) => {
		const {onPropertyChange} = this.props;
		const fill = {
			fill: color
		};
		onPropertyChange && onPropertyChange('fill', fill);
	};

	renderFillField = () => {
		const {fill} = this.props;
		const {anchorEl} = this.state;
		const open = Boolean(anchorEl);
  		const id = open ? 'simple-popover' : undefined;
		const color = fill && fill.fill;
		return (
			<Grid container>
				<Grid item >
					<Button aria-describedby={id} size="large" onClick={this.handleColorOpen} style={{background: color}}>
						fill color
					</Button>
					<CoreColorPicker
						anchorEl={anchorEl}
						id={id}
						open={open}
						handleClose={this.handleColorClose}
						onChange={this.handleFillColorChange}
						color={color}
					/>
				</Grid>
			</Grid>
			
		);
	};

	onGradientChange = (data) => {
		const {onPropertyChange} = this.props;
		const {palette, EndX, EndY, StartX, StartY} = data;
		const stops = [];
		const layoutPalette = [];
		palette.map(p => {
			stops.push(...[p.pos, p.color]);
			layoutPalette.push({pos: Number(p.pos), color: p.color});
			return false;
		});
		const fill = {
			gradientData: {...data, palette: layoutPalette},
			fill: '',
			fillPriority: `${data.gradientType.toLowerCase()}-gradient`,
			[`fill${data.gradientType}GradientEndPoint`]: {x: EndX, y: EndY},
			[`fill${data.gradientType}GradientStartPoint`]: {x: StartX, y: StartY},
			[`fill${data.gradientType}GradientColorStops`]: stops,
			fillRadialGradientEndRadius: data.gradientType === 'Radial' ? data.EndRadius : undefined,
			fillRadialGradientStartRadius: data.gradientType === 'Radial' ?data.StartRadius: undefined,
		};
		onPropertyChange && onPropertyChange('fill', fill);
	};

	renderFillGradientField = () => {
		const {fill} = this.props;
		const {gradientData} = fill;
		return (
			<GradientPicker
				onPaletteChange={this.onGradientChange}
				gradientData={gradientData}
			/>
		);
	}

	fillColorFields = {
		Fill: this.renderFillField,
		Gradient: this.renderFillGradientField
	}

	handleFillColorTypeChange = (event, selectedFillColor) => {
		const {fill, onPropertyChange} = this.props;
		if (selectedFillColor === 'Fill') {
			fill.fill = 'black';
		} else {
			fill.fill = '';
		}
		onPropertyChange && onPropertyChange('fill', fill);
	};

	render() {
		const {fill} = this.props;
		let selectedFillColorType = 'Fill';
		if (!fill.fill) {
			selectedFillColorType = 'Gradient';
		}
		return (
			<Grid container >
				<Grid item xs={12}>
					<Typography variant="h6" gutterBottom>
						Fill Color
					</Typography>
				</Grid>
				<Grid item>
					<ToggleButtonGroup size="large" exclusive value={selectedFillColorType} onChange={this.handleFillColorTypeChange}>
						<ToggleButton value="Fill">
							<i className="material-icons">
								format_color_fill
							</i>
						</ToggleButton>
						<ToggleButton value="Gradient">
							<i className="material-icons" style={{transform: 'rotate(-90deg)'}}>
								gradient
							</i>
						</ToggleButton>
					</ToggleButtonGroup>
				</Grid>

				<Grid item md={12}>
					{this.fillColorFields[selectedFillColorType]()}
				</Grid>
			</Grid>
		);
	}
};