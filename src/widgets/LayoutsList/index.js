import LayoutsListApi from './api/LayoutsListApi';
import LayoutsListReducer from './api/LayoutsListReducer';
import LayoutsListConfig from './api/LayoutsListConfig';
import LayoutsListComponent from './widget/LayoutsList.component';

export {default as LayoutsList} from './widget/LayoutsList.component';

export const widget = {
	api: LayoutsListApi,
	reducer: LayoutsListReducer,
	config: LayoutsListConfig,
	connectedWidget: LayoutsListComponent
};

export default widget;
