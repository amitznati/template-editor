import {ActionTypes} from './FiltersApi';

const initialState = {
	filters: {}
};

const reducer = (state = initialState, action) => {
	let newState = {...state};
	const payload = action && action.payload;
	const type = action && action.type;
	switch (type) {
	case ActionTypes.SET_FILTERS:
		newState = {
			...state,
			filters: {
				...state.filters,
				[`${payload.parentFilterId}`]: {
					...state.filters[payload.parentFilterId],
					filters: [...payload.filters]
				}},
		};
		break;
	case ActionTypes.ADD_PARENT_FILTER: {
		const id = `filter${Object.keys(state.filters).length + 1}`;
		const newFilter = {
			id,
			name: id,
			filters: []
		};
		newState = {
			...state,
			filters: {...state.filters, [`${id}`]: {...newFilter}}
		};
		break;
	}
	default:
		return newState;
	}
	return newState;
};

export default reducer;
