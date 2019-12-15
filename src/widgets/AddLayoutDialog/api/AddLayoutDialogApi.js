import BaseApi from '../../../sdk/BaseApi';
import selectors from './AddLayoutDialogSelectors';

export const VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
};

export const ActionTypes = {
	UPDATE_TODO: 'UPDATE_TODO',
	ADD_TODO: 'ADD_TODO',
	CHANGE_EDIT_TODO: 'CHANGE_EDIT_TODO',
	LOAD_POSTS: 'LOAD_POSTS'
};

export default class AddLayoutDialogApi extends BaseApi {


	/* Selectors */
	getVisibleToDosSelector = () => {
		return selectors.getToDosSelector(this.store.getState());
	};

	getEditToDoSelector = () => {
		return selectors.getEditToDoSelector(this.store.getState());
	};
}
