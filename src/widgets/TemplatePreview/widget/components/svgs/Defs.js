import React from 'react';

const filterTags = {
  blend: 'feBland',
  blur: 'feGaussianBlur',
  colormatrix: 'feColorMatrix',
  componentTransfer: 'feComponentTransfer',
  convolveMatrix: 'feConvolveMatrix',
  composite: 'feComposite',
  diffuseLighting: 'feDiffuseLighting',
  displacementMap: 'feDisplacementMap',
  distantLight: 'feDistantLight',
  dropShadow: 'feDropShadow',
  flood: 'feFlood',
  funcR: 'feFuncR',
  funcG: 'feFuncG',
  funcB: 'feFuncB',
  funcA: 'feFuncA',
  image: 'feImage',
  tile: 'feTile',
  merge: 'feMerge',
  mergeNode: 'feMergeNode',
  morphology: 'feMorphology',
  offset: 'feOffset',
  pointLight: 'fePointLight',
  specularLighting: 'feSpecularLighting',
  spotLight: 'feSpotLight',
  turbulence: 'feTurbulence'
};

export const GradientDef = ({ id, gradientData }) => {
  const {
    gradientType,
    EndY,
    EndX,
    StartX,
    StartY,
    EndRadius,
    palette,
    spreadMethod,
    isForGroup,
    gradientScale = 1
  } = gradientData;
  const getPoint = (point) => (isForGroup ? `${point * 100}%` : point);
  const gradientUnits = isForGroup
    ? {
        gradientUnits: 'userSpaceOnUse',
        gradientTransform: `scale(${gradientScale})`
      }
    : {};
  const stops = palette.map((point, index) => {
    return (
      <stop
        key={`stop-${index}`}
        offset={getPoint(point.pos)}
        stopColor={point.color}
      />
    );
  });
  switch (gradientType) {
    case 'Linear': {
      return (
        <linearGradient
          spreadMethod={spreadMethod}
          id={id}
          x1={getPoint(StartX)}
          y1={getPoint(StartY)}
          x2={getPoint(EndX)}
          y2={getPoint(EndY)}
          {...gradientUnits}
        >
          {stops}
        </linearGradient>
      );
    }
    case 'Radial': {
      return (
        <radialGradient
          spreadMethod={spreadMethod}
          id={id}
          cx={getPoint(StartX)}
          cy={getPoint(StartY)}
          r={getPoint(EndRadius)}
          fx={getPoint(EndX)}
          fy={getPoint(EndY)}
          {...gradientUnits}
        >
          {stops}
        </radialGradient>
      );
    }
    default:
      return '';
  }
};

export default function Defs({ templateFilters, templateGradients }) {
  const renderFilterPrimitives = (primitives) => {
    return (
      primitives &&
      primitives.map((p, i) => {
        if (p.disabled) return null;
        const TagName = filterTags[p.groupName];
        const params = {};
        Object.keys(p.params).forEach((fName) => {
          if (!p.params[fName].disabled && !p.params[fName].isIgnore) {
            params[fName] = p.params[fName].value;
          }
        });
        const key = p.id || `element-${i}`;
        return (
          <TagName {...params} key={key}>
            {renderFilterPrimitives(p.children)}
          </TagName>
        );
      })
    );
  };
  const filtersDefs = templateFilters.map((filter) => {
    if (filter.isIgnore) return null;
    const filterParams = {};
    Object.keys(filter.params).forEach((paramName) => {
      if (!filter.params[paramName].isIgnore) {
        filterParams[paramName] = filter.params[paramName].value;
      }
    });
    return (
      <filter key={filter.id} {...filterParams} id={filter.id}>
        {renderFilterPrimitives(filter.primitives)}
      </filter>
    );
  });

  const gradientsDefs = templateGradients.map((g) => {
    return <GradientDef key={g.id} id={g.id} gradientData={g.gradientData} />;
  });
  return (
    <defs>
      {filtersDefs}
      {gradientsDefs}
    </defs>
  );
}
