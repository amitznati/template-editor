import React from 'react';
import PropTypes from 'prop-types';
import { getGlobalLayoutProperties } from './SVGUtils';

const CustomSVG = (props) => {
  const ref = React.createRef();
  const { layout, index, previewOnly, logoIndex } = props;

  const { fill, src } = layout.properties;
  const createMarkup = () => {
    return { __html: src };
  };
  const layoutProperties = getGlobalLayoutProperties({
    layout,
    index,
    previewOnly,
    ref,
    logoIndex
  });

  return (
    <g
      {...layoutProperties}
      dangerouslySetInnerHTML={createMarkup()}
      fill={fill.fill}
    />
  );
};

CustomSVG.propTypes = {
  layout: PropTypes.object,
  index: PropTypes.any,
  previewOnly: PropTypes.bool
};

export default CustomSVG;
