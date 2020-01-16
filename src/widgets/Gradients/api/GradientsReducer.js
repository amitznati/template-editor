// import {ActionTypes} from './GradientsApi';
const initialState = {
	templateGradients: [],
	selectedGradientId: ''
};
// const SUCCESS = '_SUCCESS';
const reducer = (state = initialState, action) => {
	let newState = {...state};
	// const payload = action && action.payload;
	const type = action && action.type;
	switch (type) {
	default:
		return newState;
	}
};

export default reducer;
