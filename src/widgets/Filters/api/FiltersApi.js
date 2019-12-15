import BaseApi from '../../../sdk/BaseApi';
import selectors from './FiltersSelectors';
import SimpleServices from '../../../sdk/services/SimpleServices';

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
let nextTodoId = 0;
export default class FiltersApi extends BaseApi {

	changeEditValue = (value) => {
		this.dispatchStoreAction({
			type: ActionTypes.CHANGE_EDIT_TODO,
			payload: value
		});
	};

	addTodo = () => {
		const text = this.getEditToDoSelector();

		this.dispatchStoreAction({
			type: ActionTypes.ADD_TODO,
			payload: {id: nextTodoId++, text}
		});
	};

	toggleTodo = (id) => {
		const todos = this.getVisibleToDosSelector();
		const newTodos = todos.map((t) => {
			if (t.id === id) {
				t.completed = !t.completed;
			}
			return t;
		});
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_TODO,
			payload: newTodos
		});
	};

	loadDummyPosts = async () => {
		return this.serviceRequest(
			SimpleServices.getDummyPosts,
			{},
			ActionTypes.LOAD_POSTS
		);

	};

	getPostById = async (id = 1) => {
		const post = await this.serviceRequest(
			SimpleServices.getPostById,
			{id}
		);
		return post;
	};



	/* Selectors */
	getVisibleToDosSelector = () => {
		return selectors.getToDosSelector(this.store.getState());
	};

	getEditToDoSelector = () => {
		return selectors.getEditToDoSelector(this.store.getState());
	};
}
