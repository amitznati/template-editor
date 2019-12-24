import {ActionTypes} from './FiltersApi';
import {presetsData} from './../Data';
const initialState = {
	templateFilters: [],
	filtersPresets: JSON.parse(JSON.stringify(presetsData)),
	layoutFilters: []
};

const reducer = (state = initialState, action) => {
	let newState = {...state};
	const payload = action && action.payload;
	const type = action && action.type;
	switch (type) {
	case ActionTypes.UPDATE_FILTERS:
		newState = {
			...state,
			templateFilters: [...payload.filters]
		};
		break;
	case ActionTypes.ADD_NEW_FILTER_TO_TEMPLATE: {
		newState = {
			...state,
			templateFilters: [...state.templateFilters, payload.filter],
			layoutFilters: [...state.layoutFilters, payload.filter.id]
		};
		break;
	}
	case ActionTypes.ADD_FILTER_TO_LAYOUT:
		newState = {
			...state,
			layoutFilters: [...state.layoutFilters, payload.id]
		};
		break;
	default:
		return newState;
	}
	return newState;
};

export default reducer;
