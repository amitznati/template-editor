import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Text, TextPath, RootSVG} from './svgs';
import {getPX} from '../../../../sdk/utils';
import PathBuilder from './TemplatePreview.pathBuilder';

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


class TemplatePreviewMainView extends React.Component {

	onPathChange = (pathData) => {
		const {onUpdateLayout, selectedLayout} = this.props;
		selectedLayout.properties.pathData = pathData;
		onUpdateLayout(selectedLayout);
	};

	renderText(layout, index) {
		return Text({layout, index});
	}

	renderTextPath(layout, index) {
		return TextPath({layout, index});
	}

	renderLayout = {
		text: this.renderText.bind(this),
		textPath: this.renderTextPath.bind(this)
	};

	render() {
		const {template = {}, scale, product, classes, isSVGPathBuilderOpen, selectedLayout, onEditLayoutEnd, selectedLayoutIndex, onLayoutClick, onUpdateLayout} = this.props;
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

					<RootSVG
						onEditLayoutEnd={onEditLayoutEnd}
						selectedLayoutIndex={selectedLayoutIndex}
						onLayoutClick={onLayoutClick}
						onUpdateLayout={onUpdateLayout}
						h={getPX(product.templateFrame.height)}
						w={getPX(product.templateFrame.width)}
						scale={scale}
						selectedLayout={selectedLayout}
						isSVGPathBuilderOpen={isSVGPathBuilderOpen}
					>
						{layouts.map((l,i) => this.renderLayout[l.type](l,i))}
					</RootSVG>
					{isSVGPathBuilderOpen &&
						<div style={{height: templateH,width: templateW, position: 'absolute', overflow: 'hidden', bottom: 0, left: 0}}>
							<PathBuilder
								{...{scale, product, selectedLayout, onPathChange: this.onPathChange}}
							/>
						</div>
					}
				</div>
			</div>
		);
	}

}

TemplatePreviewMainView.propTypes = {
	classes: PropTypes.object.isRequired,
	template: PropTypes.object.isRequired,
	scale: PropTypes.number,
	product: PropTypes.object.isRequired,
	onUpdateLayout: PropTypes.func,
	onLayoutClick: PropTypes.func,
	onEditLayoutEnd: PropTypes.func,
	selectedLayoutIndex: PropTypes.any,
	isSVGPathBuilderOpen: PropTypes.bool
};

export default withStyles(styles)(TemplatePreviewMainView);
