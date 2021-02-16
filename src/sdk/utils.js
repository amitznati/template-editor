export const getPX = (cm, scale) => {
  const s = scale || 1;
  return Number((cm * s * (96 / 2.54)).toFixed(3));
};

export const getCM = (px, scale) => {
  const s = scale || 1;
  return Number((px / s / (96 / 2.54)).toFixed(3));
};

function deltaTransformPoint(matrix, point) {
  var dx = point.x * matrix.a + point.y * matrix.c + 0;
  var dy = point.x * matrix.b + point.y * matrix.d + 0;
  return { x: dx, y: dy };
}

export function decomposeMatrix(matrix) {
  // @see https://gist.github.com/2052247

  // calculate delta transform point
  var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
  var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

  // calculate skew
  var skewX = (180 / Math.PI) * Math.atan2(px.y, px.x) - 90;
  var skewY = (180 / Math.PI) * Math.atan2(py.y, py.x);

  return {
    translateX: matrix.e,
    translateY: matrix.f,
    scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
    scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
    skewX: skewX,
    skewY: skewY,
    rotation: skewX // rotation is the same as skew x
  };
}

// util function to convert the input to string type
function convertToString(input) {
  if (input) {
    if (typeof input === 'string') {
      return input;
    }
    return String(input);
  }
  return '';
}

// convert string to words
function toWords(input) {
  input = convertToString(input);
  var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  return input.match(regex);
}

// convert the input array to camel case
function toCamelCase(inputArray) {
  let result = '';
  for (let i = 0, len = inputArray.length; i < len; i++) {
    const currentStr = inputArray[i];
    let tempStr = currentStr.toLowerCase();
    if (i !== 0) {
      // convert first letter to upper case (the word is in lowercase)
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }
    result += tempStr;
  }
  return result;
}

// this function call all other functions
export function toCamelCaseString(input) {
  const words = toWords(input);
  return toCamelCase(words);
}
export default {
  getCM,
  getPX,
  decomposeMatrix,
  toCamelCaseString
};
