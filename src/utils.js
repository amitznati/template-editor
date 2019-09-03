export const getPX = (cm, scale) => {
	const s = scale || 1;
	return Number( (cm * s * (96 / 2.54)).toFixed(2) );
};

export const getCM = (px, scale) => {
	const s = scale || 1;
	return Number( (px / s / (96 / 2.54)).toFixed(2) );
};

export default {
	getCM,
	getPX
};