import ShapesBuilderApi from './api/ShapesBuilderApi';
import ShapesBuilderReducer from './api/ShapesBuilderReducer';
import ShapesBuilderConfig from './api/ShapesBuilderConfig';

export const widget = {
	api: ShapesBuilderApi,
	reducer: ShapesBuilderReducer,
	config: ShapesBuilderConfig,
};

export default widget;
