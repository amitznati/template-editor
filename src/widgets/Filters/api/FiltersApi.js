import BaseApi from '../../../sdk/BaseApi';
import selectors from './FiltersSelectors';
import arrayMove from 'array-move';
import {primitivesAttrs, primitivesData} from '../Data';
import {getInstance} from '../../../sdk';

export const ActionTypes = {
	UPDATE_FILTERS: 'UPDATE_FILTERS',
	ADD_NEW_FILTER_TO_TEMPLATE: 'ADD_NEW_FILTER_TO_TEMPLATE',
	ADD_PRESET_FILTER_TO_TEMPLATE: 'ADD_PRESET_FILTER_TO_TEMPLATE',
	ADD_FILTER_TO_LAYOUT: 'ADD_FILTER_TO_LAYOUT'
};

export default class FiltersApi extends BaseApi {

	updateFilters = (filters) => {
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_FILTERS,
			payload: {filters}
		});
	};

	getNextFilterId = () => {
		const templateFilters = this.getTemplateFiltersSelector();
		let nextIdNumber = 1;
		templateFilters.forEach(f => {
			if (f.id.includes('filter-')) {
				const idNumber = Number(f.id.replace('filter-', ''));
				if (idNumber >= nextIdNumber) {
					nextIdNumber = idNumber + 1;
				}
			}
		});
		return `filter-${nextIdNumber}`;
	};

	createNewFilter = () => {
		const id = this.getNextFilterId();
		return {
			id,
			name: id,
			primitives: []
		};
	};

	createFilterFromPreset = (id) => {
		const filtersPresets = this.getFiltersPresetsSelector();
		const preset = filtersPresets.find(f => f.id === id);
		const clonedFilter = JSON.parse(JSON.stringify(preset));
		clonedFilter.id = this.getNextFilterId();
		return clonedFilter;
	};

	getLayoutFiltersIds = () => {
		const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
		const {selectedLayout}= editTemplateMainViewApi.getSelectedLayoutSelector();
		return selectedLayout.properties.filters;
	};

	addFilterIdToLayout = (id) => {
		const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
		const {selectedLayout} = editTemplateMainViewApi.getSelectedLayoutSelector();
		selectedLayout.properties.filters.push(id);
		editTemplateMainViewApi.onUpdateLayout(selectedLayout);
	};

	onAddFilterFromPresets = (item) => {
		const filter = this.createFilterFromPreset(item.id);
		this.dispatchStoreAction({
			type: ActionTypes.ADD_NEW_FILTER_TO_TEMPLATE,
			payload: {filter: filter}
		});
		this.addFilterIdToLayout(filter.id);
	};

	onAddParentFilter = (item) => {
		if (item && item.id === 'new') {
			const newFilter = this.createNewFilter();
			this.dispatchStoreAction({
				type: ActionTypes.ADD_NEW_FILTER_TO_TEMPLATE,
				payload: {filter: newFilter}
			});
			this.addFilterIdToLayout(newFilter.id);
		} else {
			this.dispatchStoreAction({
				type: ActionTypes.ADD_FILTER_TO_LAYOUT,
				payload: {id: item.id}
			});
			this.addFilterIdToLayout(item.id);
		}

	};

	onAttributeChange = ({parentFilterId, index, name, value, childIndex}) => {
		const filters = this.getPrimitivesByFilterId(parentFilterId);
		if (!isNaN(childIndex)) {
			filters[index].children[childIndex].params[name].value = value;
		} else {
			filters[index].params[name].value = value;
		}
		this.setPrimitives(parentFilterId, filters);
	};

	onSortEnd = ({parentFilterId, oldIndex, newIndex, filterIndex}) => {
		const filters = this.getPrimitivesByFilterId(parentFilterId);
		let newFilters = [...filters];
		if (!isNaN(filterIndex)) {
			const newChildren = arrayMove(filters[filterIndex].children, oldIndex, newIndex);
			newFilters[filterIndex].children = newChildren;
		} else {
			newFilters = arrayMove(filters, oldIndex, newIndex);
		}
		this.setPrimitives(parentFilterId, newFilters);
	};

	onDeleteFilter = ({parentFilterId, index, childIndex}) => {
		const filters = this.getPrimitivesByFilterId(parentFilterId);
		let newFilters = [...filters];
		if (!isNaN(childIndex)) {
			newFilters[index].children.splice(childIndex,1);
		} else {
			newFilters.splice(index, 1);
		}
		this.setPrimitives(parentFilterId, newFilters);
	};

	onAddFilter = (parentFilterId, filterItem) => {
		const primitiveToAdd = this.getFilterDataByGroupName(filterItem.groupName);
		const primitives = this.getPrimitivesByFilterId(parentFilterId);
		const sameGroupPrimitives = primitives.filter(f => f.groupName === filterItem.groupName);
		if (sameGroupPrimitives.length) {
			primitiveToAdd.id = `${primitiveToAdd.id}-${sameGroupPrimitives.length}`;
			primitiveToAdd.params.result.value = primitiveToAdd.id;
		}
		this.setPrimitives(parentFilterId, [...primitives, primitiveToAdd]);
	};

	onAddChildFilter = (parentFilterId, filterItem, filterParent) => {
		const filterData = this.getFilterDataByGroupName(filterParent.groupName);
		const childFilter = filterData.children.find(f => f.groupName === filterItem.groupName);
		const clonedChild = JSON.parse(JSON.stringify(childFilter));
		const sameGroupFilters = filterParent.children.filter(f => f.groupName === filterItem.groupName);
		const filters = this.getPrimitivesByFilterId(parentFilterId);
		const newFilters = filters.map((f) => {
			if (f.id === filterParent.id) {
				clonedChild.id = `${clonedChild.id}-${sameGroupFilters.length}`;
				f.children.push(clonedChild);
			}
			return f;
		});
		this.setPrimitives(parentFilterId, newFilters);
	};

	onSelectSingleChild = ({parentFilterId, primitive, childPrimitive}) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === parentFilterId) {
				f.primitives.forEach(parentPrimitive => {
					if (parentPrimitive.id === primitive.id) {
						parentPrimitive.children.forEach(c => {
							c.disabled = childPrimitive.id !== c.id;
						});
					}
				});
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	setPrimitives = (parentFilterId, primitives) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === parentFilterId) {
				f.primitives = primitives;
			}
			return f;
		});
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_FILTERS,
			payload: {filters: newFilters}
		});
	};

	getChildrenFiltersNamesList = (filter) => {
		const filterData = this.getFilterDataByGroupName(filter.groupName);
		return this.getPrimitivesNamesListSelector(filterData);
	};

	getPrimitivesByFilterId = (parentFilterId) => {
		const filters = this.getTemplateFiltersSelector();
		const filter = filters.find(f => f.id === parentFilterId);
		return filter.primitives;
	};

	getPrimitivesNamesListSelector = (byFilter) => {
		const filters = byFilter ? byFilter.children : primitivesData;
		const filtersNamesList = filters.map(item => {
			const groupData = primitivesAttrs[item.groupName];
			if (item.groupName) {
				return  {name: groupData.name, groupName: item.groupName, id: item.id};
			}
			return {};
		});

		return filtersNamesList;
	};

	getFilterDataByGroupName = (groupName) => {
		const filter = primitivesData.find(f => f.groupName === groupName);
		return filter ? JSON.parse(JSON.stringify(filter)) : {};
	};

	getFiltersPresetsNames = () => {
		const filtersPresets = this.getFiltersPresetsSelector();
		const filtersNamesToReturn = filtersPresets.map(f => {
			return {
				name: f.name,
				id: f.id
			};
		});
		return filtersNamesToReturn;
	};

	getFiltersTemplateNames = () => {
		const filters = this.getTemplateFiltersSelector();
		const ids = this.getLayoutFiltersIds();
		const filteredFilters = filters.filter(f => !ids.includes(f.id));
		const filtersNamesToReturn = filteredFilters.map(f => {
			return {
				name: f.name,
				id: f.id
			};
		});
		filtersNamesToReturn.unshift({name: 'New Filter...', id: 'new'});
		return filtersNamesToReturn;
	};

	getTemplateFiltersSelector = () => {
		return selectors.getTemplateFiltersSelector(this.store.getState());
	};

	getFiltersPresetsSelector = () => {
		return selectors.getFiltersPresetsSelector(this.store.getState());
	};

	getLayoutFiltersSelector = () => {
		const ids = this.getLayoutFiltersIds();
		const templateFilters = this.getTemplateFiltersSelector();
		return templateFilters.filter(f => ids.includes(f.id));
	};
}
