import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {CoreText, CoreSlider} from '../components/core';
import styles from '../styles/styles';

class TemplateProperties extends React.Component {

	getViewProperties = () => {
		const { product, onProductChanged } = this.props;
		const {
			name: productName,
			productSize: {height: productH,width: productW }, 
			templateFrame: {height: templateFrameH, width: templateFrameW, x: templateFrameX, y: templateFrameY}} = product;
		return {
			onProductChanged,
			productName,
			productH,
			productW,
			templateFrameH,
			templateFrameW,
			templateFrameX,
			templateFrameY
		};
	}

	onProductSizeChanged = (name, value) => {
		let {product,onProductChanged} = this.props;
		product.productSize[name] = value;
		onProductChanged(product);
	}

	ontemplateFrameChanged = (name,value) => {
		let {product,onProductChanged} = this.props;
		product.templateFrame[name] = value;
		onProductChanged(product);
	}

	onNameChanged = (value) => {
		let {product,onProductChanged} = this.props;
		product.name = value;
		onProductChanged(product);
	}

	renderSelectProduct = () => {
		return (
			<Button variant="outlined" color="primary" >
				Select Product
			</Button>
		);
	}

	render() {
		const {product} = this.props;
		if (!product) {
			return this.renderSelectProduct();
		}
		const props = this.getViewProperties();
		return (
			<Grid container >
				<Grid item md={3}>
					<CoreText
						label="Name"
						value={props.productName}
						handleTextChange={(v) => this.onNameChanged(v)}
					/>
					<CoreSlider
						label="Width"
						value={props.productW}
						handleSliderChange={(v)=> this.onProductSizeChanged('width',v)}
					/>
					<CoreSlider
						label="height"
						value={props.productH}
						handleSliderChange={(v)=> this.onProductSizeChanged('height',v)}
					/>
				</Grid>
				<Grid item md={3}>
					<CoreSlider
						label="Template Height"
						value={props.templateFrameH}
						handleSliderChange={(v)=> this.ontemplateFrameChanged('height',v)}
					/>
					<CoreSlider
						label="Template Width"
						value={props.templateFrameW}
						handleSliderChange={(v)=> this.ontemplateFrameChanged('width',v)}
					/>
					<CoreSlider
						label="Template X"
						value={props.templateFrameX}
						handleSliderChange={(v)=> this.ontemplateFrameChanged('x',v)}
					/>
					<CoreSlider
						label="Template Y"
						value={props.templateFrameY}
						handleSliderChange={(v)=> this.ontemplateFrameChanged('y',v)}
					/>
				</Grid>
			</Grid>				
		);
	}
}

TemplateProperties.propTypes = {
	classes: PropTypes.object.isRequired,
	product: PropTypes.object,
	onProductChanged: PropTypes.func.isRequired
};

export default withStyles(styles)(TemplateProperties);
