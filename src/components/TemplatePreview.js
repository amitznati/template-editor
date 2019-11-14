import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SVGPathBuilder from './core/SVGPathBuilder';
import {Text, TextPath, RootSVG} from './svgs';

import {getPX, getCM /* , decomposeMatrix */} from './../utils';
const styles = theme => ({
	templateRoot: {
		//background: 'white',
		position: 'absolute',
		margin: 'auto',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		borderRadius: 0
	},
	padding: {
		padding: theme.spacing(1)
	},
	productImage: {
		//boxShadow: '2px 3px 14px -3px rgba(0,0,0,0.75)',
		position: 'absolute'
		
	}
});


class TemplatePreview extends React.Component {

	getPX = (cm) => {
		const s = this.props.scale || 0.1;
		return Number( (cm * s * (96 / 2.54)).toFixed(2) );
	}

	getCM = (px) => {
		const s = this.props.scale || 0.1;
		return Number( (px / s / (96 / 2.54)).toFixed(2) );
	}

	getLayout() {
		const {template = {}, selectedLayoutIndex} = this.props;
		const {layouts = []} = template;
		const layout = layouts[selectedLayoutIndex];
		return layout;
	}

	onUpdateNode = (node) => {
		const layout = this.getLayout(node);
		layout.properties.scaleX = node.attrs.scaleX;
		layout.properties.scaleY = node.attrs.scaleY;
		layout.properties.rotation = node.attrs.rotation;
		layout.properties.x = getCM(node.attrs.x);
		layout.properties.y = getCM(node.attrs.y);
		this.props.onUpdateLayout(layout);
	}

	onPathChange = (pathData, node) => {
		const layout = this.getLayout(node);
		const {onUpdateLayout} = this.props;
		layout.properties.pathData = pathData;
		onUpdateLayout(layout);
	};

	// renderImage(layout, index) {
	// 	const p = layout.properties;
	// 	return (
	// 		<URLImage
	// 			key={index}
	// 			src={p.src}
	// 			x={getPX(p.x)}
	// 			y={getPX(p.y)}
	// 			height={getPX(p.height)}
	// 			width={getPX(p.width)}
	// 			scaleX={p.scaleX}
	// 			scaleY={p.scaleY}
	// 			rotation={p.rotation}
	// 			name={`${index}`}
	// 			onUpdateNode={this.onUpdateNode}
	// 		/>
	// 	);
	// }
	renderText(layout, index) {
		return Text({layout, index});
		// const p = layout.properties;
		// const {x, y, fill, fontStyle, fontWeight, ...rest} = p;
		// return (
		// 	<Text 
		// 		key={index} 
		// 		x={getPX(x)}
		// 		y={getPX(y)}
		// 		{...fill}
		// 		name={`${index}`}
		// 		onUpdateNode={this.onUpdateNode}
		// 		fontStyle={`${fontWeight} ${fontStyle}`}
		// 		{...rest}
		// 	/>
		// );
	}

	renderTextPath(layout, index) {
		return TextPath({layout, index});
	// 	const p = layout.properties;
	// 	const {x, y, fill, fontStyle, fontWeight, ...rest} = p;
	// 	return (
	// 		<TextPath 
	// 			key={index} 
	// 			x={getPX(x)}
	// 			y={getPX(y)}
	// 			{...fill}
	// 			name={`${index}`}
	// 			onUpdateNode={this.onUpdateNode}
	// 			fontStyle={`${fontWeight} ${fontStyle}`}
	// 			{...rest}
	// 		/>
	// 	);
	}

	renderLayout = {
		text: this.renderText.bind(this),
		textPath: this.renderTextPath.bind(this),
		//image: this.renderImage.bind(this),
	};

	renderPathBuilder = () => {
		const {template = {}, scale, product, selectedLayoutIndex} = this.props;
		const {layouts = []} = template;
		const selectedLayout = layouts[selectedLayoutIndex];
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
		const {template = {}, scale, product, classes, selectedLayoutIndex, isSVGPathBuilderOpen} = this.props;
		const {layouts = []} = template;
		const selectedLayout = layouts[selectedLayoutIndex];
		const productH = getPX(product.productSize.height, scale);
		const productW = getPX(product.productSize.width, scale);
		const templateH = getPX(product.templateFrame.height, scale);
		const templateW = getPX(product.templateFrame.width, scale);
		const templateX = getPX(product.templateFrame.x, scale);
		const templateY = getPX(product.templateFrame.y, scale);
		return (
			<div style={{height: productH,width: productW, position: 'relative'}}>
				<img className={classes.productImage} src={product.image} alt="product" style={{height: productH,width: productW}}/>
				<div id="templateDiv" style={{height: templateH,width: templateW, position: 'absolute', overflow: 'hidden', bottom: templateY, left: templateX}}>
					
					<RootSVG
						onEditLayoutEnd={this.props.onEditLayoutEnd}
						selectedLayoutIndex={this.props.selectedLayoutIndex}
						onLayoutClick={this.props.onLayoutClick}
						onUpdateLayout={this.props.onUpdateLayout}
						h={getPX(product.templateFrame.height)}
						w={getPX(product.templateFrame.width)}
						scale={scale}
						selectedLayout={selectedLayout}
					>
						{layouts.map((l,i) => this.renderLayout[l.type](l,i))}
					</RootSVG>
					{isSVGPathBuilderOpen &&
						<div style={{height: templateH,width: templateW, position: 'absolute', overflow: 'hidden', bottom: 0, left: 0}}>
							{this.renderPathBuilder()}
						</div>
					}
				</div>
			</div>
		);
	}
	
}

TemplatePreview.propTypes = {
	classes: PropTypes.object.isRequired,
	template: PropTypes.object.isRequired,
	scale: PropTypes.number,
	product: PropTypes.object.isRequired,
	onUpdateLayout: PropTypes.func,
	onLayoutClick: PropTypes.func,
	onEditLayoutEnd: PropTypes.func,
	selectedLayoutIndex: PropTypes.any
};

export default withStyles(styles)(TemplatePreview);
