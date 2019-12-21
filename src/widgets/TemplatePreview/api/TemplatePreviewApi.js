import {getInstance} from 'sdk';
import BaseApi from '../../../sdk/BaseApi';
export const ActionTypes = {

};
export default class TemplatePreviewApi extends BaseApi {

	onPathChange = (pathData) => {
		const {EditTemplateMainViewApi: {getSelectedLayoutSelector, onUpdateLayout}} = getInstance();
		const {selectedLayout} = getSelectedLayoutSelector();
		selectedLayout.properties.pathData = pathData;
		onUpdateLayout(selectedLayout);
	};


}
