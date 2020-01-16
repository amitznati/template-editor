import LayoutsListApi from './api/LayoutsListApi';
import LayoutsListReducer from './api/LayoutsListReducer';
import LayoutsListConfig from './api/LayoutsListConfig';

export const widget = {
	api: LayoutsListApi,
	reducer: LayoutsListReducer,
	config: LayoutsListConfig,
};

export default widget;
