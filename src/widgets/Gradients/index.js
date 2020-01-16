import GradientsApi from './api/GradientsApi';
import GradientsReducer from './api/GradientsReducer';
import GradientsConfig from './api/GradientsConfig';

export const widget = {
	api: GradientsApi,
	reducer: GradientsReducer,
	config: GradientsConfig,
};

export default widget;
