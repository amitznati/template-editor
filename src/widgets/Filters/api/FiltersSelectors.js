import { createSelector } from 'reselect';
import config from './FiltersConfig';

const sliceSelector = state => state[config.sliceName];

export const getTemplateFiltersSelector = createSelector(sliceSelector, (slice) => {
	return slice.templateFilters;
});

export const getFiltersPresetsSelector = createSelector(sliceSelector, (slice) => {
	return slice.filtersPresets;
});

export const getLayoutFiltersSelector = createSelector(sliceSelector, (slice) => {
	return slice.layoutFilters;
});

export default {
	getTemplateFiltersSelector,
	getFiltersPresetsSelector,
	getLayoutFiltersSelector
};
