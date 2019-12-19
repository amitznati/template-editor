import AddLayoutDialogApi from './api/AddLayoutDialogApi';
import AddLayoutDialogReducer from './api/AddLayoutDialogReducer';
import AddLayoutDialogConfig from './api/AddLayoutDialogConfig';
import AddLayoutDialogComponent from './widget/AddLayoutDialog.component';

export const widget = {
	api: AddLayoutDialogApi,
	reducer: AddLayoutDialogReducer,
	config: AddLayoutDialogConfig,
	connectedWidget: AddLayoutDialogComponent
};

export default widget;
