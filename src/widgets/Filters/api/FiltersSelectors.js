import { createSelector } from 'reselect';
import config from './FiltersConfig';

const sliceSelector = state => state[config.sliceName];

export const getFiltersSelector = createSelector(sliceSelector, (slice) => {
	return slice.filters;
});

export const getFiltersNamesListSelector = createSelector(sliceSelector, (slice) => {
	return slice.filtersNamesList;
});


export default {
	getFiltersSelector,
	getFiltersNamesListSelector
};
