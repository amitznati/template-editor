import { createSelector } from 'reselect';
import config from './LayoutsListConfig';

const sliceSelector = state => state[config.sliceName];

export const getToDosSelector = createSelector(sliceSelector, (slice) => {
	return slice.toDos;
});

export const getEditToDoSelector = createSelector(sliceSelector, (slice) => {
	return slice.editToDo;
});

export default {
	getToDosSelector,
	getEditToDoSelector
};
