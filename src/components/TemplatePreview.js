import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DesignCanvas from './LayoutsKonvaJS/DesignCanvas';

import Text from './LayoutsKonvaJS/Text';

import {getPX/* , getCM, decomposeMatrix */} from './../utils';
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

	// onUpdateNode = (data) => {
	// 	const {selectedLayout, scale} = this.props;
	// 	selectedLayout.properties.scaleX = data.scaleX;
	// 	selectedLayout.properties.scaleY = data.scaleY;
	// 	selectedLayout.properties.rotation = data.rotation;
	// 	selectedLayout.properties.x = getCM(data.x, scale);
	// 	selectedLayout.properties.y = getCM(data.y, scale);
	// 	this.props.onUpdateLayout(layout);
	// }

	onPathChange = (pathData, node) => {
		const layout = this.getLayout(node);
		const {onUpdateLayout} = this.props;
		layout.properties.pathData = pathData;
		onUpdateLayout(layout);
	};

	renderText(layout, index) {
		return Text({layout, index, scale: this.props.scale});
	}


	renderLayout = {
		text: this.renderText.bind(this)
	};

	render() {
		const {template = {}, scale, product, classes, selectedLayout} = this.props;
		const {layouts = []} = template;
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
					<DesignCanvas
						onEditLayoutEnd={this.props.onEditLayoutEnd}
						selectedLayoutIndex={this.props.selectedLayoutIndex}
						onLayoutClick={this.props.onLayoutClick}
						onUpdateLayout={this.props.onUpdateLayout}
						h={templateH}
						w={templateW}
						scale={scale}
						selectedLayout={selectedLayout}
					>
						{layouts.map((l,i) => this.renderLayout[l.type](l,i))}
					</DesignCanvas>
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
