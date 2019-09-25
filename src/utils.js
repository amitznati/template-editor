export const getPX = (cm, scale) => {
	const s = scale || 1;
	return Number( (cm * s * (96 / 2.54)).toFixed(2) );
};

export const getCM = (px, scale) => {
	const s = scale || 1;
	return Number( (px / s / (96 / 2.54)).toFixed(2) );
};

function deltaTransformPoint(matrix, point)  {

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
	var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
	var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

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
export default {
	getCM,
	getPX,
	decomposeMatrix
};
