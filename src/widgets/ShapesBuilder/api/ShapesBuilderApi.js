import BaseApi from '../../../sdk/BaseApi';
import selectors from './ShapesBuilderSelectors';

export const ActionTypes = {
	UPDATE_DATA: 'UPDATE_DATA'
};
export default class ShapesBuilderApi extends BaseApi {

	updateData = (data) => {
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_DATA,
			payload: data
		});
	};

	getDataSelector = () => {
		return selectors.getDataSelector(this.store.getState());
	};
}
