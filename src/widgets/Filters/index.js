import FiltersApi from './api/FiltersApi';
import FiltersReducer from './api/FiltersReducer';
import FiltersConfig from './api/FiltersConfig';

export const widget = {
	api: FiltersApi,
	reducer: FiltersReducer,
	config: FiltersConfig,
};

export default widget;
