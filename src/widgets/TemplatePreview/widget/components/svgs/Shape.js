import React from 'react';
import { getPX } from '../../../../../sdk/utils';
import cx from 'classnames';

export default function Shape({ layout, index }) {
  const shapeRef = React.createRef();
  const {
    x,
    y,
    fill,
    transform: {
      skewY = 0,
      skewX = 0,
      scaleX = 1,
      scaleY = 1,
      translateX = 0,
      translateY = 0
    },
    filters,
    shapeSvg
  } = layout.properties;
  const layoutFill = fill.fill;
  const layoutProperties = {
    x: getPX(x),
    y: getPX(y),
    transform: `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`
  };

  const styleFilter = {};
  if (filters.length) {
    styleFilter.style = {
      filter: filters.map((f) => `url(#${f})`).join(' ')
    };
  }

  const shapeProperties = {
    fill: layoutFill,
    ...layoutProperties
  };
  const ShapeSvg = shapeSvg.type;
  return (
    <g
      {...shapeProperties}
      {...styleFilter}
      className={cx('drag-svg')}
      name={index}
      key={`shape_${index}`}
      ref={shapeRef}
      layoutindex={index}
    >
      <ShapeSvg {...shapeSvg.props} />
    </g>
  );
}
