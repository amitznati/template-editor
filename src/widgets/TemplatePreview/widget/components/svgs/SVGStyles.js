import React from 'react';

export default function SVGStyles({ allFonts }) {
  return allFonts.map(({ fontFamily, fontUrl, fontProvider }) => {
    const key = `${fontFamily}-${fontUrl}`;
    if (fontProvider === 'google') {
      return (
        <style key={key} xmlns='http://www.w3.org/2000/svg' type='text/css'>
          {`@import url(${fontUrl});`}
        </style>
      );
    }
    return (
      <style xmlns='http://www.w3.org/2000/svg' type='text/css' key={key}>
        {`@font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
        }`}
      </style>
    );
  });
}
