import {ActionTypes} from './FiltersApi';

const initialState = {
	filters: []
};

const reducer = (state = initialState, action) => {
	let newState = {...state};
	const payload = action && action.payload;
	const type = action && action.type;
	switch (type) {
	case ActionTypes.SET_FILTERS:
		newState = {
			...state,
			filters: [...payload],
		};
		break;
	default:
		return newState;
	}
	return newState;
};

export default reducer;
