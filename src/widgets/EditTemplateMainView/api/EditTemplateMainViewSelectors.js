import { createSelector } from 'reselect';
import config from './EditTemplateMainViewConfig';

const sliceSelector = state => state[config.sliceName];

export const getTemplateSelector = createSelector(sliceSelector, (slice) => {
	return slice.template;
});

export const getSelectedLayoutSelector = createSelector(sliceSelector, (slice) => {
	return slice.selectedLayout;
});

export const getIsSVGPathBuilderOpenSelector = createSelector(sliceSelector, (slice) => {
	return slice.isSVGPathBuilderOpen;
});

export const getProductSelector = createSelector(sliceSelector, (slice) => {
	return slice.product;
});

export const getScaleSelector = createSelector(sliceSelector, (slice) => {
	return slice.scale;
});

export const isAddLayoutDialogOpenSelector = createSelector(sliceSelector, (slice) => {
	return slice.isAddLayoutDialogOpen;
});

export const isAllFontLoadedSelector = createSelector(sliceSelector, (slice) => {
	return slice.allFontsLoaded;
});

export default {
	getTemplateSelector,
	getSelectedLayoutSelector,
	getIsSVGPathBuilderOpenSelector,
	getProductSelector,
	getScaleSelector,
	isAddLayoutDialogOpenSelector,
	isAllFontLoadedSelector
};
