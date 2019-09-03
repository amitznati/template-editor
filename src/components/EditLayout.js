import React from 'react';
import PropTypes from 'prop-types';
import {Fab, Paper, Grid, Button, Typography} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup}  from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import {CoreSlider, CoreText, CoreColorPicker, CoreFontSelector, CoreAutocomplete}  from '../components/core';
import GradientPicker from './GradientPicker';
import SVGPathSelector from './SVGPathSelector';
import LayoutPropertiesList from './editLayoutFields/layoutPropertiesList';

const fields = {
	text: [
		{type: 'text', name: 'text'},
		{type: 'font'},
		{type: 'fontStyle'},
		{type: 'position'},
		{type: 'number', name: 'fontSize'},
		{type: 'number', name: 'scaleX'},
		{type: 'number', name: 'scaleY'},
		{type: 'fillColor'}
		
	],
	image: [
		{type: 'position'},
		{type: 'size'}
	],
};
fields.textPath = [
	...fields.text,
	{type: 'pathSelector'}
];
const styles = theme => ({
	paper: {
		margin: theme.spacing(1),
		marginLeft: 0,
		borderRadius: 0
	},
	fab: {
		margin: theme.spacing(1),
	},
	fillColor: {
		height: 100,
		// width: 100
	}
});

class EditLayout extends React.Component {

	handleChange = (name,value) => {
		let {layout, onUpdate} = this.props;
		layout.properties[name] = value;
		onUpdate(layout);
	};
	state = {
		open: false,
		selectedFillColor: 'Gradient'
	};

	onPropertyChange = (name,value) => {
		let {layout, onUpdate} = this.props;
		layout.properties[name] = value;
		onUpdate(layout);
	};

	handleToggle = () => {
		this.setState(state => ({ open: !state.open }));
	};

	handleClose = (event, selectedFillColor) => {
		if (this.anchorEl.contains(event.target)) {
			return;
		}
		this.setState({ open: false, selectedFillColor });
	};

	renderTextField(field){
		const {layout, classes} = this.props;
		const val = layout.properties[field.name];
		return (
			<div className={classes.fab}>
				<CoreText
					label={field.name}
					value={val}
					handleTextChange={(v) => this.handleChange(field.name,v)}
				/>
			</div>
		);
	}
	
	renderNumberField(field){
		const {classes, layout} = this.props;
		const val = layout.properties[field.name];
		return (
			<div className={classes.fab}>
				<CoreSlider 
					label={field.name}
					className={classes.textField}
					value={val}
					handleSliderChange={(v) => this.handleChange(field.name,v)}
					step={0.01}
				/>
			</div>
		);
	}
	renderSizeField(){
		return (
			<div>
				{this.renderNumberField({type: 'number',name: 'height'})}
				{this.renderNumberField({type: 'number',name: 'width'})}
			</div>
		);
	}
	renderPositionField(){
		return (
			<div>
				{this.renderNumberField({type: 'number',name: 'x'})}
				{this.renderNumberField({type: 'number',name: 'y'})}
				{this.renderNumberField({type: 'number',name: 'rotation'})}
			</div>
		);
	}
	handleColorOpen = (e) => {
		this.setState({colorPickerOpen: true, anchorEl: e.currentTarget});
	};

	handleColorClose = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({colorPickerOpen: false, anchorEl: null});
	};

	handleFillColorChange = (color) => {
		const {layout, onUpdate} = this.props;
		layout.properties.fill = {
			fill: color
		};
		onUpdate(layout);
	};

	renderFillField = () => {
		const {layout} = this.props;
		const color = layout.properties.fill && layout.properties.fill.fill;
		return (
			<Grid container justify="center">
				<Grid item >
					<Button size="large" onClick={this.handleColorOpen} style={{background: color}}>
						fill color
						{this.state.colorPickerOpen && 
							<CoreColorPicker 
								handleClose={this.handleColorClose}
								onChange={this.handleFillColorChange}
								color={color}
							/>
						}
					</Button>
					
				</Grid>
			</Grid>
			
		);
	};

	onGradientChange = (data) => {
		const {layout, onUpdate} = this.props;
		const {palette, EndX, EndY, StartX, StartY} = data;
		const stops = [];
		const layoutPalette = [];
		palette.map(p => {
			stops.push(...[p.pos, p.color]);
			layoutPalette.push({pos: Number(p.pos), color: p.color});
			return false;
		});
		layout.properties.fill = {
			gradientData: {...data, palette: layoutPalette},
			fill: '',
			fillPriority: `${data.gradientType.toLowerCase()}-gradient`,
			[`fill${data.gradientType}GradientEndPoint`]: {x: EndX, y: EndY},
			[`fill${data.gradientType}GradientStartPoint`]: {x: StartX, y: StartY},
			[`fill${data.gradientType}GradientColorStops`]: stops,
			fillRadialGradientEndRadius: data.gradientType === 'Radial' ? data.EndRadius : undefined,
			fillRadialGradientStartRadius: data.gradientType === 'Radial' ?data.StartRadius: undefined,
		};
		onUpdate(layout);
	};

	renderFillGradientField = () => {
		const {layout} = this.props;
		const {gradientData} = layout.properties.fill;
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
		const {layout, onUpdate} = this.props;
		if (selectedFillColor === 'Fill') {
			layout.properties.fill.fill = 'black';
		} else {
			layout.properties.fill.fill = '';
		}
		onUpdate(layout);
	};

	renderFillColorField = () => {
		const {layout: {properties: {fill}}} = this.props;
		let selectedFillColorType = 'Fill';
		if (!fill.fill) {
			selectedFillColorType = 'Gradient';
		}
		return (
			<Grid container >
				<Grid item xs={12} style={{margin: '15px'}}>
					<Typography variant="h6" gutterBottom>
						Fill Color
					</Typography>
				</Grid>
				<Grid item style={{margin: '0 15px'}}>
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

				<Grid item md={12} style={{margin: '15px'}}>
					{this.fillColorFields[selectedFillColorType]()}
				</Grid>
			</Grid>
		);
	}

	renderFontSelector = () => {
		const {layout: {properties: {fontStyle, fontWeight}}} = this.props;
		return (
			<Grid container justify="center">
				<Grid item>
					<CoreFontSelector
						onChange={v => this.handleChange('fontFamily', v)}
						{...{fontWeight, fontStyle}}
					/>
				</Grid>
			</Grid>
			
		);
	};

	renderFontStyle = () => {
		const options = ['100', '200', '300', 'bold'].map(v => {
			return {label: v, value: v};
		});
		return (
			<CoreAutocomplete
				options={options}
				label="Font Style"
			/>
		);
	};


	renderPathSelector = () => {
		const {onTogglePathBuilder, layout} = this.props;
		return (
			<Grid container justify="center">
				<Grid item>
					<SVGPathSelector 
						toggleOpen={onTogglePathBuilder}
						path={layout.properties.pathData && layout.properties.pathData.path}
					/>
				</Grid>
			</Grid>
			
		); 
	};

	renderFields(field) {
		let renderedField = <div></div>;
		switch(field.type){
		case 'text':
			renderedField = this.renderTextField(field);
			break;
		case 'position': 
			renderedField = this.renderPositionField();
			break;
		case 'number':
			renderedField = this.renderNumberField(field);
			break;
		case 'size':
			renderedField = this.renderSizeField();
			break;
		case 'fillColor':
			renderedField = this.renderFillColorField();
			break;
		case 'font':
			renderedField = this.renderFontSelector();
			break;
		case 'fontStyle':
			renderedField = this.renderFontStyle();
			break;
		case 'pathSelector':
			renderedField = this.renderPathSelector();
			break;
		default:
			renderedField = <div></div>;
		}
		return (
			<Grid item xs={12} key={`${field.name}-${field.type}`}>
				{renderedField}
			</Grid>
		);
	}
	render() {
		const {classes, layout, onBack} = this.props;
		return (
			<Paper className={classes.paper}>
				<Fab size="medium" color="secondary" className={classes.fab} onClick={onBack}>
					<BackIcon />
				</Fab>
				<Grid container>
					{/* {fields[layout.type].map(this.renderFields.bind(this))} */}
					<LayoutPropertiesList onPropertyChange={this.onPropertyChange} layout={layout}/>
				</Grid>
			</Paper>
		);
	}
}

EditLayout.propTypes = {
	classes: PropTypes.object.isRequired,
	layout: PropTypes.object.isRequired,
	onBack: PropTypes.func.isRequired,
	onUpdate: PropTypes.func.isRequired,
	onTogglePathBuilder: PropTypes.func
};

export default withStyles(styles)(EditLayout);