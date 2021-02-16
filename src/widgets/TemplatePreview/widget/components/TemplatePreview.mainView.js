import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Text, TextPath, Image, RootSVG, Defs, Shape, CustomSVG } from './svgs';
import Logo from './svgs/Logo';
import PathBuilder from './TemplatePreview.pathBuilder';
import SVGStyles from './svgs/SVGStyles';

const styles = (theme) => ({
  templateRoot: {
    // background: 'white',
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
    // boxShadow: '2px 3px 14px -3px rgba(0,0,0,0.75)',
    position: 'absolute'
  }
});

class TemplatePreviewMainView extends React.Component {
  renderText(layout, index, previewOnly) {
    return Text({ layout, index, previewOnly });
  }

  renderTextPath(layout, index, previewOnly) {
    return TextPath({ layout, index, previewOnly });
  }

  renderImage(layout, index, previewOnly) {
    return Image({ layout, index, previewOnly });
  }

  renderShape(layout, index, previewOnly) {
    return Shape({ layout, index, previewOnly });
  }

  renderCustomSVG(layout, index, previewOnly) {
    return CustomSVG({ layout, index, previewOnly });
  }

  renderLogo(layout, index, previewOnly) {
    const { logoProps } = this.props;
    return Logo({ layout, index, previewOnly, logoProps });
  }

  renderLayout = {
    text: this.renderText.bind(this),
    textPath: this.renderTextPath.bind(this),
    image: this.renderImage.bind(this),
    shape: this.renderShape.bind(this),
    customSVG: this.renderCustomSVG.bind(this),
    logo: this.renderLogo.bind(this)
  };

  render() {
    const {
      product,
      classes,
      PathBuilderProps,
      SVGRootProps,
      DefsProps,
      previewOnly,
      SVGStylesProps
    } = this.props;
    const {
      layouts,
      productH,
      productW,
      templateH,
      templateW,
      templateX,
      templateY
    } = this.props;
    const renderedLayouts = layouts
      .filter((l) => !l.isIgnore)
      .map((l, i) => {
        return this.renderLayout[l.type](l, i, previewOnly);
      });
    return (
      <div
        style={{
          height: productH,
          width: productW,
          position: 'relative',
          margin: 'auto',
          background: product.imageUrl ? '' : 'white'
        }}
      >
        {product.imageUrl && (
          <img
            className={classes.productImage}
            src={product.imageUrl}
            alt='product'
            style={{ height: productH, width: productW }}
          />
        )}
        <div
          id='templateDiv'
          style={{
            height: templateH,
            width: templateW,
            position: 'absolute',
            overflow: 'hidden',
            bottom: templateY,
            left: templateX,
            boxShadow: product.imageUrl ? 'none' : '3px 3px 5px 6px #ccc'
          }}
        >
          <RootSVG {...SVGRootProps}>
            <Defs {...DefsProps} />
            <SVGStyles {...SVGStylesProps} />
            {renderedLayouts}
          </RootSVG>
          {!previewOnly && SVGRootProps.isSVGPathBuilderOpen && (
            <div
              style={{
                height: templateH,
                width: templateW,
                position: 'absolute',
                overflow: 'hidden',
                bottom: 0,
                left: 0
              }}
            >
              <PathBuilder {...PathBuilderProps} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TemplatePreviewMainView);
