import { createSelector } from 'reselect';
import config from './GradientsConfig';

const sliceSelector = state => state[config.sliceName];

export const templateGradientsSelector = createSelector(sliceSelector, (slice) => {
	return slice.templateGradients;
});

export const getSelectedGradientIdSelector = createSelector(sliceSelector, (slice) => {
	return slice.selectedGradientId;
});

export default {
	templateGradientsSelector,
	getSelectedGradientIdSelector
};
