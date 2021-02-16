import React from 'react';
import PropTypes from 'prop-types';
import { getGlobalLayoutProperties } from './SVGUtils';
import { Text, TextPath, Image, Defs, CustomSVG } from './index';
import { getAllFonts } from '../../TemplatePreview.propsMappar';
import SVGStyles from './SVGStyles';

const Logo = (props) => {
  const ref = React.createRef();
  const { layout, index, previewOnly, logoProps } = props;
  const { h, w } = logoProps;
  const layoutProperties = getGlobalLayoutProperties({
    layout,
    index,
    previewOnly,
    ref
  });
  const {
    template: { layouts, ...rest }
  } = layout.properties;
  const allFonts = getAllFonts({ layouts });
  return (
    <g {...layoutProperties}>
      <svg viewBox={`0 0 ${w} ${h}`} xmlns='http://www.w3.org/2000/svg'>
        <Defs {...rest} />
        <SVGStyles allFonts={allFonts} />
        {layouts.map((layout, layoutIndex) => {
          const props = {
            previewOnly: true,
            index: layoutIndex,
            layout,
            logoIndex: index
          };
          switch (layout.type) {
            case 'text':
              return Text(props);
            case 'textPath':
              return TextPath(props);
            case 'image':
              return Image(props);
            case 'customSVG':
              return CustomSVG(props);
            default:
              return <div key={`logo-${index}`} />;
          }
        })}
      </svg>
    </g>
  );
};

Logo.propTypes = {
  layout: PropTypes.object,
  index: PropTypes.any,
  previewOnly: PropTypes.bool
};

export default Logo;
