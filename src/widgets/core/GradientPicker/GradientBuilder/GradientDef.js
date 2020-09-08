import React from 'react';

const GradientDef = ({ gradientId, gradientData }) => {
  const {
    gradientType,
    EndY,
    EndX,
    StartX,
    StartY,
    EndRadius,
    palette,
    spreadMethod
  } = gradientData;
  const stops = palette.map((point, index) => {
    return (
      <stop key={`stop-${index}`} offset={point.pos} stopColor={point.color} />
    );
  });
  let shape = '';
  switch (gradientType) {
    case 'Linear': {
      shape = (
        <linearGradient
          spreadMethod={spreadMethod}
          id={gradientId}
          x1={StartX}
          y1={StartY}
          x2={EndX}
          y2={EndY}
        >
          {stops}
        </linearGradient>
      );
      break;
    }
    case 'Radial': {
      shape = (
        <radialGradient
          spreadMethod={spreadMethod}
          id={gradientId}
          cx={StartX}
          cy={StartY}
          r={EndRadius}
          fx={EndX}
          fy={EndY}
        >
          {stops}
        </radialGradient>
      );
      break;
    }
    default:
      return '';
  }

  return <defs key={gradientId}>{shape}</defs>;
};

export default GradientDef;
