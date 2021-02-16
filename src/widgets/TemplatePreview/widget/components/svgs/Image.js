import React from 'react';
import PropTypes from 'prop-types';
import { getGlobalLayoutProperties } from './SVGUtils';

const Image = (props) => {
  const ref = React.createRef();
  const { layout, index, previewOnly, logoIndex } = props;
  const { src, fullSizeProperties } = layout.properties;
  const layoutProperties = getGlobalLayoutProperties({
    layout,
    index,
    previewOnly,
    ref,
    logoIndex
  });

  return (
    <g {...layoutProperties}>
      <image
        {...fullSizeProperties}
        data-layout-index={index}
        data-logo-index={logoIndex}
        href={src}
      />
    </g>
  );
};

Image.propTypes = {
  layout: PropTypes.object,
  index: PropTypes.any,
  previewOnly: PropTypes.bool
};

export default Image;
