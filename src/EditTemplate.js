import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Button, Paper} from '@material-ui/core';
import LayoutsList from './components/LayoutsList';
import arrayMove from 'array-move';
import EditLayout from './components/EditLayout';
import AddLayoutDialog from './components/addLayoutDialog';
import TemplatePreview from './components/TemplatePreview';
import ProductProperties from './components/ProductProperties';
import {products} from './mocks';
import {CoreSlider, SVGPathBuilder} from './components/core';
import FontLoader from './fontLoader';
import {getPX} from './utils';
import withRoot from './withRoot';

const styles = theme => ({
	section: {
		padding: '20px 0'
	},
	templatePaper: {
		position: 'relative',
		overflow: 'auto',
		padding: '20px 0',
		margin: 0
	},
	rootGrid: {
		// minHeight: '100%',
		padding: theme.spacing(1)
	}
}); 


const defaultPosition = {
	x: 5, y: 10, transform: {}
};

const defaultFontProps = {
	fontSize: 40, fontFamily: 'Raleway',fontStyle: 'italic', fontWeight: '100'
};

const layoutsTemplate = (type,payload) => {
	switch(type) {
	case 'image':
		return {
			type: 'image',
			properties: {
				src: payload.url,
				x:8,y:8,height: 5,width:5, rotation: 0, scaleX: 1, scaleY: 1
			}
		};
	case 'text': 
		return {
			type: 'text',
			properties: {
				text: payload,
				...defaultPosition,
				...defaultFontProps,
				strokeWidth: 0, stroke: '',
				fill: {fill: 'black'},
				
			}
		};
	case 'textPath': {
		const x = getPX(5);
		const y = getPX(10);
		return {
			type: 'textPath',
			properties: {
				text: payload,
				x: 5, y: 10, transform: {},
				...defaultFontProps,
				fill: {fill: 'black'}, strokeWidth: 0, stroke: '',
				pathData: {path: `M ${x} ${y} L ${x + 200} ${y}`, initialPoints: [{x, y}, {x: x + 200, y}]}
			}
		};
	}
	default:
		return '';
	}
};

class EditTemplate extends React.Component {

	state = {
		template: {layouts: []}, //call(apis.TEMPLATES,methods.BYID,1),
		product: products[0],
		selectedLayout: null,
		isAddOpen: false,
		selectedLayoutIndex: -1,
		scale: 0.5,
		allFontsLoaded: false,
		isSVGPathBuilderOpen: false
	};

	componentDidMount() {
		let {template} = this.state;
		// and all the men and women merely players.
		//template.layouts.push(layoutsTemplate('text','text All the worlds a stage,'));
		template.layouts.push(layoutsTemplate('textPath','All the worlds a stage,'));
		this.setState({template});
		
	}

	onTemplateChanged(template) {
		this.setState({template});
	}

	onLayoutClick = (index) => {
		const {layouts} = this.state.template;
		this.setState({selectedLayout: layouts[index], selectedLayoutIndex: index});
	};

	onDeleteLayout(index) {
		let {template} = this.state;
		template.layouts.splice(index,1);
		this.setState({template});
	}

	onSortEnd = ({oldIndex, newIndex}) => {
		let {template} = this.state;
		const newLayouts = arrayMove(template.layouts, oldIndex, newIndex);
		template.layouts = newLayouts;
		this.setState({template});
	};

	handleAddClose(type,payload){
		if(!type) {
			this.setState({isAddOpen: false});
			return;
		}
		let {template} = this.state;

		template.layouts.push(layoutsTemplate(type,payload));
		
		this.setState({isAddOpen: false, template});
	}

	onUpdateLayout = (layout) => {
		let {template, selectedLayoutIndex} = this.state;
		template.layouts[selectedLayoutIndex] = layout;
		this.setState({template});
	}

	saveTemplate = () => {
		//mockService('templates','create',this.state.template);
	}

	onEditLayoutEnd = () => {
		this.setState({selectedLayout: null, selectedLayoutIndex: -1, isSVGPathBuilderOpen: false});
	}

	getAllFonts = () => {
		const {template} = this.state;
		const {layouts = []} = template;
		const allFonts = [];
		layouts.map(l => {
			const {fontFamily, fontStyle, fontWeight} = l.properties;
			if (l.type === 'text' || l.type === 'textPath') {
				allFonts.push(`${fontFamily}:${fontWeight || 300}${fontStyle || 'normal'}`);
			}
			return false;
		});
		return allFonts;
	};


	onPathChange = (pathData) => {
		let {template, selectedLayoutIndex} = this.state;
		template.layouts[selectedLayoutIndex].properties.pathData = pathData;
		this.setState({template});
	};

	onTogglePathBuilder = () => {
		const {isSVGPathBuilderOpen} = this.state;
		this.setState({isSVGPathBuilderOpen: !isSVGPathBuilderOpen});
	};

	renderPathBuilder = () => {
		const {selectedLayout, product, scale} = this.state;
		const {pathData, x, y} = selectedLayout && selectedLayout.properties;
		let initialPoints = [
			{x: getPX(x), y: getPX(y)}, {x: getPX(x) + 200, y: getPX(y)}
		];
		if (pathData && pathData.points) {
			initialPoints = pathData.points;
		}
		const w = getPX(product.templateFrame.width, scale);
		const h = getPX(product.templateFrame.height, scale);
		return (
			<SVGPathBuilder
				onChange={this.onPathChange}
				{...{w, h}}
				layout={selectedLayout}
				initialPoints={initialPoints}
				gridSize={product.templateFrame.width}
				scale={scale}
			/>
		);
	};

	render() {
		const {classes} = this.props;
		const {selectedLayout, template, scale, product, selectedLayoutIndex, allFontsLoaded, isSVGPathBuilderOpen} = this.state;
		const {layouts = []} = template;
		const allFonts = this.getAllFonts();
		
		return (
			<Grid container className={classes.rootGrid}>
				<AddLayoutDialog 
					open={this.state.isAddOpen}
					onClose={this.handleAddClose.bind(this)}
				/>
				<Grid item xs={12} className={classes.section}>
					<Button variant="outlined" color="primary" onClick={this.saveTemplate}>
						Save
					</Button>
				</Grid>
				<Grid item xs={12} className={classes.section}>
					<Paper>
						<ProductProperties  product={undefined} onProductChanged={(p) => this.setState({product: p})}/>
					</Paper>
				</Grid>
				<Grid item md={2} className={classes.section}>
					<Button variant="outlined" color="primary" onClick={() => this.setState({isAddOpen: true})}>
					+ Add Layout
					</Button>
					{!selectedLayout && <LayoutsList 
						onSortEnd={this.onSortEnd.bind(this)} 
						layouts={layouts} 
						onLayoutClick={this.onLayoutClick.bind(this)}
						onDeleteLayout={this.onDeleteLayout.bind(this)}
					/>}
					{selectedLayout && <EditLayout 
						layout={selectedLayout} 
						onBack={this.onEditLayoutEnd}
						onUpdate={this.onUpdateLayout.bind(this)}
						onTogglePathBuilder={this.onTogglePathBuilder.bind(this)}
					/>}
				</Grid>
				{product && <Grid item md={10} className={classes.section}>
					<CoreSlider
						label="Scale"
						value={scale}
						max={3}
						step={0.001}
						handleSliderChange={(v)=>this.setState({scale: Number(Number(v).toFixed(2))})}
					/>
					<div className={classes.templatePaper}>
						{allFontsLoaded && <TemplatePreview 
							scale={scale} 
							product={product} 
							template={template}
							onUpdateLayout={this.onUpdateLayout}
							onLayoutClick={this.onLayoutClick}
							onEditLayoutEnd={this.onEditLayoutEnd}
							selectedLayoutIndex={selectedLayoutIndex}
							selectedLayout={selectedLayout}
							isSVGPathBuilderOpen={isSVGPathBuilderOpen}
						/>}
						{allFonts && allFonts.length && <FontLoader
							fontProvider="google"
							fontFamilies={allFonts}
							onActive={() => this.setState({allFontsLoaded: true})}
						/>}
					</div>
				</Grid>}
				{/* {isSVGPathBuilderOpen && this.renderPathBuilder()} */}
			</Grid>
		);
	}
}
EditTemplate.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(EditTemplate));
