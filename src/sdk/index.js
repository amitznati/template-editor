import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/* EditTemplateMainView */
import EditTemplateMainViewApi from '../widgets/EditTemplateMainView/api/EditTemplateMainViewApi';
import EditTemplateMainViewConfig from '../widgets/EditTemplateMainView/api/EditTemplateMainViewConfig';
import EditTemplateMainViewReducer from '../widgets/EditTemplateMainView/api/EditTemplateMainViewReducer';
/* TemplatePreview */
import TemplatePreviewApi from '../widgets/TemplatePreview/api/TemplatePreviewApi';
import TemplatePreviewConfig from '../widgets/TemplatePreview/api/TemplatePreviewConfig';
import TemplatePreviewReducer from '../widgets/TemplatePreview/api/TemplatePreviewReducer';
/* Filters */
import FiltersApi from '../widgets/Filters/api/FiltersApi';
import FiltersConfig from '../widgets/Filters/api/FiltersConfig';
import FiltersReducer from '../widgets/Filters/api/FiltersReducer';
/* AddLayoutDialog */
import AddLayoutDialogApi from '../widgets/AddLayoutDialog/api/AddLayoutDialogApi';
import AddLayoutDialogConfig from '../widgets/AddLayoutDialog/api/AddLayoutDialogConfig';
import AddLayoutDialogReducer from '../widgets/AddLayoutDialog/api/AddLayoutDialogReducer';

let storeInstance;
const createStoreInstance = () => {
	const reducerMap = {
		[EditTemplateMainViewConfig.sliceName]: EditTemplateMainViewReducer,
		[TemplatePreviewConfig.sliceName]: TemplatePreviewReducer,
		[FiltersConfig.sliceName]: FiltersReducer,
		[AddLayoutDialogConfig.sliceName]: AddLayoutDialogReducer
	};
	return createStore(
		combineReducers(reducerMap),
		composeWithDevTools()
	);
};
export const getStoreInstance = () => {
	if (!storeInstance) {
		storeInstance = createStoreInstance();
	}
	return storeInstance;
};

let instance;
const createInstance = () => {
	return {
		EditTemplateMainViewApi: new EditTemplateMainViewApi(getStoreInstance()),
		TemplatePreviewApi: new TemplatePreviewApi(getStoreInstance()),
		FiltersApi: new FiltersApi(getStoreInstance()),
		AddLayoutDialogApi: new AddLayoutDialogApi(getStoreInstance())
	};
};

export const getInstance = () => {
	if (!instance) {
		instance = createInstance();
	}
	return instance;
};


export default {
	getStoreInstance,
	getInstance
};
