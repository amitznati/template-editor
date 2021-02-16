import BaseApi from '../../../sdk/BaseApi';
import selectors from './TemplatePreviewSelectors';

export const ActionTypes = {
  SET_IS_NODE_REFRESH_REQUIRE: 'SET_IS_NODE_REFRESH_REQUIRE'
};
export default class TemplatePreviewApi extends BaseApi {
  onPathChange = (pathData) => {
    const {
      EditTemplateMainViewApi: { getSelectedLayoutSelector, onUpdateLayout }
    } = this.apis;
    const { selectedLayout } = getSelectedLayoutSelector();
    selectedLayout.properties.pathData = pathData;
    onUpdateLayout(selectedLayout);
  };

  setIsNodeRefreshRequire = (isRequire) => {
    this.dispatchStoreAction({
      type: ActionTypes.SET_IS_NODE_REFRESH_REQUIRE,
      payload: isRequire
    });
  };

  isNodeRefreshRequireSelector = () => {
    return selectors.isNodeRefreshRequireSelector(this.store.getState());
  };
}
