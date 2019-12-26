import AddLayoutDialogApi from './api/AddLayoutDialogApi';
import AddLayoutDialogReducer from './api/AddLayoutDialogReducer';
import AddLayoutDialogConfig from './api/AddLayoutDialogConfig';
import AddLayoutDialogConnect from './widget/AddLayoutDialog.connect';

export const widget = {
	api: AddLayoutDialogApi,
	reducer: AddLayoutDialogReducer,
	config: AddLayoutDialogConfig,
	connectedWidget: AddLayoutDialogConnect
};

export default widget;
