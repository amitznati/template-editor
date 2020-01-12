import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Text, TextPath, Image, RootSVG} from './svgs';
import PathBuilder from './TemplatePreview.pathBuilder';
import Defs from './svgs/Defs';

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

	renderText(layout, index) {
		return Text({layout, index});
	}

	renderTextPath(layout, index) {
		return TextPath({layout, index});
	}

	renderImage(layout, index) {
		return Image({layout, index});
	}

	renderLayout = {
		text: this.renderText.bind(this),
		textPath: this.renderTextPath.bind(this),
		image: this.renderImage.bind(this)
	};

	render() {
		const {product, classes, PathBuilderProps, SVGRootProps, templateFilters} = this.props;
		const {
			layouts,
			productH,
			productW,
			templateH,
			templateW,
			templateX,
			templateY
		} = this.props;
		const renderedLayouts = layouts.filter(l => !l.isIgnore).map((l,i) => {
			return this.renderLayout[l.type](l,i);
		});
		return (
			<div style={{height: productH,width: productW, position: 'relative'}}>
				<img className={classes.productImage} src={product.image} alt="product" style={{height: productH,width: productW}}/>
				<div id="templateDiv" style={{height: templateH,width: templateW, position: 'absolute', overflow: 'hidden', bottom: templateY, left: templateX}}>
					<RootSVG
						{...SVGRootProps}
					>
						<Defs templateFilters={templateFilters} />
						{renderedLayouts}
					</RootSVG>
					{SVGRootProps.isSVGPathBuilderOpen &&
						<div style={{height: templateH,width: templateW, position: 'absolute', overflow: 'hidden', bottom: 0, left: 0}}>
							<PathBuilder
								{...PathBuilderProps}
							/>
						</div>
					}
				</div>
			</div>
		);
	}

}

export default withStyles(styles)(TemplatePreviewMainView);
