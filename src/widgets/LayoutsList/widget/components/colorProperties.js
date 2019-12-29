import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup}  from '@material-ui/lab';
import { CoreColorPicker } from '../../../core';
import GradientPicker from './GradientPicker';

class ColorProperties extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			colorPickerOpen: false,
			strokeAnchorEl: null,

		};
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
		const id = open ? 'fill-color-popover' : undefined;
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
		const {onPropertyChange, fill} = this.props;
		const {palette} = data;
		const layoutPalette = [];
		palette.map(p => {
			layoutPalette.push({pos: Number(p.pos), color: p.color});
			return false;
		});
		fill.gradientData = {...data, palette: layoutPalette};
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
	};

	fillColorFields = {
		Fill: this.renderFillField,
		Gradient: this.renderFillGradientField
	};

	handleFillColorTypeChange = (event, selectedFillColorType) => {
		const {fill, onPropertyChange} = this.props;
		fill.selectedFillColorType = selectedFillColorType || 'Fill';
		onPropertyChange && onPropertyChange('fill', fill);
	};

	render() {
		const {fill} = this.props;
		const {selectedFillColorType = 'Fill'} = fill;
		return (
			<Grid container >
				<Grid item xs={12}>
						Fill Color
				</Grid>
				<Grid item>
					<ToggleButtonGroup size="medium" exclusive value={selectedFillColorType} onChange={this.handleFillColorTypeChange}>
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
}

ColorProperties.propTypes = {
	fill: PropTypes.any,
	onPropertyChange: PropTypes.func
};

export default ColorProperties;
