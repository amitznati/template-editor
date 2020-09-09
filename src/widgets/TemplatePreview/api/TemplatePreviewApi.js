import BaseApi from '../../../sdk/BaseApi';
export const ActionTypes = {};
export default class TemplatePreviewApi extends BaseApi {
  onPathChange = (pathData) => {
    const {
      EditTemplateMainViewApi: { getSelectedLayoutSelector, onUpdateLayout }
    } = this.apis;
    const { selectedLayout } = getSelectedLayoutSelector();
    selectedLayout.properties.pathData = pathData;
    onUpdateLayout(selectedLayout);
  };
}
