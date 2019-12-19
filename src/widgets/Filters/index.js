import FiltersApi from './api/FiltersApi';
import FiltersReducer from './api/FiltersReducer';
import FiltersConfig from './api/FiltersConfig';
import FiltersComponent from './widget/Filters.component';

export const widget = {
	api: FiltersApi,
	reducer: FiltersReducer,
	config: FiltersConfig,
	connectedWidget: FiltersComponent
};

export default widget;
