import React from 'react';
import PropTypes from 'prop-types';
import { getGlobalLayoutProperties } from './SVGUtils';

const Text = (props) => {
  const ref = React.createRef();
  const { layout, index, previewOnly, logoIndex } = props;
  const { fontFamily, fontSize, fontWeight, text, fill } = layout.properties;
  const layoutFill = fill.fill;
  const layoutProperties = getGlobalLayoutProperties({
    layout,
    index,
    previewOnly,
    ref,
    logoIndex
  });
  const textProperties = {
    fontFamily,
    fontSize,
    fontWeight,
    fill: layoutFill
  };

  return (
    <g {...layoutProperties}>
      <text
        data-layout-index={index}
        data-logo-index={logoIndex}
        {...textProperties}
      >
        {text}
      </text>
    </g>
  );
};

Text.propTypes = {
  layout: PropTypes.object,
  index: PropTypes.any
};

export default Text;
