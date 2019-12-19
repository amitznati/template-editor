import TemplatePreviewApi from './api/TemplatePreviewApi';
import TemplatePreviewReducer from './api/TemplatePreviewReducer';
import TemplatePreviewConfig from './api/TemplatePreviewConfig';
import TemplatePreviewComponent from './widget/TemplatePreview.component';

export const widget = {
	api: TemplatePreviewApi,
	reducer: TemplatePreviewReducer,
	config: TemplatePreviewConfig,
	connectedWidget: TemplatePreviewComponent
};

export {default as TemplatePreview} from './widget/TemplatePreview.component';

export default widget;
