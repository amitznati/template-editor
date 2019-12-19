import EditTemplateMainViewApi from './api/EditTemplateMainViewApi';
import EditTemplateMainViewReducer from './api/EditTemplateMainViewReducer';
import EditTemplateMainViewConfig from './api/EditTemplateMainViewConfig';
import EditTemplateMainViewConnect from './widget/EditTemplateMainView.connect';

export const widget = {
	api: EditTemplateMainViewApi,
	reducer: EditTemplateMainViewReducer,
	config: EditTemplateMainViewConfig,
	connectedWidget: EditTemplateMainViewConnect
};

export default widget;
