import TemplatePreviewApi from './api/TemplatePreviewApi';
import TemplatePreviewReducer from './api/TemplatePreviewReducer';
import TemplatePreviewConfig from './api/TemplatePreviewConfig';

export const widget = {
	api: TemplatePreviewApi,
	reducer: TemplatePreviewReducer,
	config: TemplatePreviewConfig,
};

export default widget;
