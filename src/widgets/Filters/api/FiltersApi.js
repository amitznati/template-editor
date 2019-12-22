import BaseApi from '../../../sdk/BaseApi';
import selectors from './FiltersSelectors';
import arrayMove from 'array-move';
import {primitivesAttrs, primitivesData} from '../Data';

export const ActionTypes = {
	SET_FILTERS: 'SET_FILTERS'
};

export default class FiltersApi extends BaseApi {

	onAttributeChange = ({index, name, value, childIndex}) => {
		const filters = this.getFiltersSelector();
		const newFilters = filters.map((f,i) => {
			if (i === index) {
				if (!isNaN(childIndex)) {
					f.children[childIndex].params[name].value = value;
				} else {
					f.params[name].value = value;
				}
			}
			return f;
		});
		this.setFilters(newFilters);
	};
	onSortEnd = ({oldIndex, newIndex}) => {
		const filters = this.getFiltersSelector();
		const newFilters = arrayMove(filters, oldIndex, newIndex);
		this.setFilters(newFilters);
	};
	onSortChildrenEnd = ({oldIndex, newIndex, filterIndex}) => {
		const filters = this.getFiltersSelector();
		const newFilters = filters.map((f,i) => {
			if (i === filterIndex) {
				f.children = arrayMove(f.children, oldIndex, newIndex);
			}
			return f;
		});
		this.setFilters(newFilters);
	};

	onDeleteFilter = (index, childIndex) => {
		const filters = this.getFiltersSelector();
		let newFilters = [...filters];
		if (!isNaN(childIndex)) {
			newFilters[index].children.splice(childIndex,1);
		} else {
			newFilters.splice(index, 1);
		}
		this.setFilters(newFilters);
	};

	onAddFilter = (filterItem) => {
		const filterToAdd = this.getFilterDataByGroupName(filterItem.groupName);
		const filters = this.getFiltersSelector();
		const sameGroupFilters = filters.filter(f => f.groupName === filterItem.groupName);
		filterToAdd.id = `${filterToAdd.id}-${sameGroupFilters.length}`;
		this.setFilters([...filters, filterToAdd]);
	};

	onAddChildFilter = (filterItem, filterParent) => {
		const filterData = this.getFilterDataByGroupName(filterParent.groupName);
		const childFilter = filterData.children.find(f => f.groupName === filterItem.groupName);
		const clonedChild = JSON.parse(JSON.stringify(childFilter));
		const sameGroupFilters = filterParent.children.filter(f => f.groupName === filterItem.groupName);
		const filters = this.getFiltersSelector();
		const newFilters = filters.map((f) => {
			if (f.id === filterParent.id) {
				clonedChild.id = `${clonedChild.id}-${sameGroupFilters.length}`;
				f.children.push(clonedChild);
			}
			return f;
		});
		this.setFilters(newFilters);
	};

	setFilters = (filters) => {
		this.dispatchStoreAction({
			type: ActionTypes.SET_FILTERS,
			payload: filters
		});
	};

	getChildrenFiltersNamesList = (filter) => {
		const filterData = this.getFilterDataByGroupName(filter.groupName);
		return this.getFiltersNamesListSelector(filterData);
	};

	getFiltersSelector = () => {
		return selectors.getFiltersSelector(this.store.getState());
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

	getPrimitivesData = () => {
		return [...primitivesData];
	};

	getFilterDataByGroupName = (groupName) => {
		const data = this.getPrimitivesData();
		const filter = data.find(f => f.groupName === groupName);
		return JSON.parse(JSON.stringify(filter));
	}
}
