import React from 'react';
import PropTypes from 'prop-types';
import { getPX } from '../../../../../sdk/utils';
import { getGlobalLayoutProperties } from './SVGUtils';

const getPathDef = (id, pathData) => {
  const path = pathData.path;
  return (
    <defs key={id}>
      <path id={id} fill='none' d={path} />
    </defs>
  );
};

const TextPath = (props) => {
  const ref = React.createRef();
  const { layout, index, previewOnly, logoIndex } = props;
  const {
    fontFamily,
    fontSize,
    fontWeight,
    x,
    y,
    text,
    fill,
    pathData
  } = layout.properties;
  const layoutFill = fill.fill;
  const shapes = [];

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
  if (!pathData.path) {
    pathData.path = `M ${getPX(x)} ${getPX(y)} L ${getPX(x) + 200} ${getPX(y)}`;
  }
  shapes.push(getPathDef(`Path-${index}`, pathData));

  shapes.push(
    <text {...layoutProperties} {...textProperties}>
      <textPath
        data-layout-index={index}
        data-logo-index={logoIndex}
        href={`#Path-${index}`}
      >
        {text}
      </textPath>
    </text>
  );

  return shapes;
};

TextPath.propTypes = {
  layout: PropTypes.object.isRequired,
  index: PropTypes.any.isRequired
};

export default TextPath;
