import BaseApi from '../../../sdk/BaseApi';
import selectors from './FiltersSelectors';
import arrayMove from 'array-move';
import {primitivesAttrs, primitivesData} from '../Data';

export const ActionTypes = {
	SET_FILTERS: 'SET_FILTERS',
	ADD_PARENT_FILTER: 'ADD_PARENT_FILTER'
};

export default class FiltersApi extends BaseApi {

	onAddParentFilter = () => {
		this.dispatchStoreAction({
			type: ActionTypes.ADD_PARENT_FILTER
		});
	};

	onAttributeChange = ({parentFilterId, index, name, value, childIndex}) => {
		const filters = this.getFiltersSelector(parentFilterId);
		if (!isNaN(childIndex)) {
			filters[index].children[childIndex].params[name].value = value;
		} else {
			filters[index].params[name].value = value;
		}
		this.setFilters(parentFilterId, filters);
	};

	onSortEnd = ({parentFilterId, oldIndex, newIndex, filterIndex}) => {
		const filters = this.getFiltersSelector(parentFilterId);
		let newFilters = [...filters];
		if (!isNaN(filterIndex)) {
			const newChildren = arrayMove(filters[filterIndex].children, oldIndex, newIndex);
			newFilters[filterIndex].children = newChildren;
		} else {
			newFilters = arrayMove(filters, oldIndex, newIndex);
		}
		this.setFilters(parentFilterId, newFilters);
	};

	onDeleteFilter = ({parentFilterId, index, childIndex}) => {
		const filters = this.getFiltersSelector(parentFilterId);
		let newFilters = [...filters];
		if (!isNaN(childIndex)) {
			newFilters[index].children.splice(childIndex,1);
		} else {
			newFilters.splice(index, 1);
		}
		this.setFilters(parentFilterId, newFilters);
	};

	onAddFilter = (parentFilterId, filterItem) => {
		const filterToAdd = this.getFilterDataByGroupName(filterItem.groupName);
		const filters = this.getFiltersSelector(parentFilterId);
		const sameGroupFilters = filters.filter(f => f.groupName === filterItem.groupName);
		filterToAdd.id = `${filterToAdd.id}-${sameGroupFilters.length}`;
		this.setFilters(parentFilterId, [...filters, filterToAdd]);
	};

	onAddChildFilter = (parentFilterId, filterItem, filterParent) => {
		const filterData = this.getFilterDataByGroupName(filterParent.groupName);
		const childFilter = filterData.children.find(f => f.groupName === filterItem.groupName);
		const clonedChild = JSON.parse(JSON.stringify(childFilter));
		const sameGroupFilters = filterParent.children.filter(f => f.groupName === filterItem.groupName);
		const filters = this.getFiltersSelector(parentFilterId);
		const newFilters = filters.map((f) => {
			if (f.id === filterParent.id) {
				clonedChild.id = `${clonedChild.id}-${sameGroupFilters.length}`;
				f.children.push(clonedChild);
			}
			return f;
		});
		this.setFilters(parentFilterId, newFilters);
	};

	setFilters = (parentFilterId, filters) => {
		this.dispatchStoreAction({
			type: ActionTypes.SET_FILTERS,
			payload: {filters, parentFilterId}
		});
	};

	getChildrenFiltersNamesList = (filter) => {
		const filterData = this.getFilterDataByGroupName(filter.groupName);
		return this.getFiltersNamesListSelector(filterData);
	};

	getFiltersSelector = (parentFilterId) => {
		const filters = selectors.getFiltersSelector(this.store.getState());
		return parentFilterId ? filters[parentFilterId].filters : filters;
	};

	getFiltersNamesListSelector = (byFilter) => {
		const filters = byFilter ? byFilter.children : primitivesData;
		const filtersNamesList = filters.map(item => {
			const groupData = primitivesAttrs[item.groupName];
			if (item.groupName) {
				return  {name: groupData.name, groupName: item.groupName};
			}
			return {};
		});

		return filtersNamesList;
	};

	getFilterDataByGroupName = (groupName) => {
		const filter = primitivesData.find(f => f.groupName === groupName);
		return filter ? JSON.parse(JSON.stringify(filter)) : {};
	}
}
