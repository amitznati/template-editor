import BaseApi from '../../../sdk/BaseApi';
import selectors from './FiltersSelectors';
import arrayMove from 'array-move';
import {primitivesAttrs, primitivesData} from '../Data';
import {getInstance} from '../../../sdk';
import {toCamelCaseString} from 'utils';

export const ActionTypes = {
	UPDATE_FILTERS: 'UPDATE_FILTERS',
	ADD_NEW_FILTER_TO_TEMPLATE: 'ADD_NEW_FILTER_TO_TEMPLATE',
	ADD_PRESET_FILTER_TO_TEMPLATE: 'ADD_PRESET_FILTER_TO_TEMPLATE',
	ADD_FILTER_TO_LAYOUT: 'ADD_FILTER_TO_LAYOUT',
	SET_CONVERTED_FILTER: 'SET_CONVERTED_FILTER'
};

const filterInitParams = {
	x: {value: '-20%'},
	y: {value: '-20%'},
	width: {value: '140%'},
	height: {value: '140%'},
	filterUnits: {value: 'objectBoundingBox'},
	primitiveUnits: {value: 'userSpaceOnUse'},
	colorInterpolationFilters: {value: 'linearRGB'}
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
		const clonedParams = JSON.parse(JSON.stringify(filterInitParams));
		return {
			id,
			name: id,
			primitives: [],
			params: clonedParams
		};
	};

	createFilterFromPreset = (id) => {
		const filtersPresets = this.getFiltersPresetsSelector();
		const preset = filtersPresets.find(f => f.id === id);
		const clonedFilter = JSON.parse(JSON.stringify(preset));
		const clonedParams = JSON.parse(JSON.stringify(filterInitParams));
		clonedFilter.id = this.getNextFilterId();
		clonedFilter.params = clonedParams;
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

	removeFilterFromLayout = (filterId) => {
		const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
		const {selectedLayout} = editTemplateMainViewApi.getSelectedLayoutSelector();
		selectedLayout.properties.filters = selectedLayout.properties.filters.filter(f => f !== filterId);
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

	onFilterAttributeChange = ({filterId, name, value}) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === filterId) {
				f.params[name].value = value;
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	onIgnoreFilterAttribute = ({filterId, name}) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === filterId) {
				f.params[name].isIgnore = !f.params[name].isIgnore;
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	onIgnoreFilter = (filterId) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === filterId) {
				f.isIgnore = !f.isIgnore;
				// TODO f.isIgnore ? this.removeFilterFromLayout(f.id) : this.addFilterIdToLayout(f.id);
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	onIgnoreAttribute = ({name, primitiveIndex, filterId, childIndex}) => {
		const filters  = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {

			if (f.id === filterId) {
				if (!isNaN(childIndex)) {
					f.primitives[primitiveIndex].children[childIndex].params[name].isIgnore =
						!f.primitives[primitiveIndex].children[childIndex].params[name].isIgnore;
				} else {
					f.primitives[primitiveIndex].params[name].isIgnore = !f.primitives[primitiveIndex].params[name].isIgnore;
				}
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	onFilterNameChange = ({filterId, value}) => {
		const filters = this.getTemplateFiltersSelector();
		const newFilters = filters.map(f => {
			if (f.id === filterId) {
				f.name = value;
			}
			return f;
		});
		this.updateFilters(newFilters);
	};

	onSortEnd = ({parentFilterId, oldIndex, newIndex, filterIndex}) => {
		const filters = this.getPrimitivesByFilterId(parentFilterId);
		let newFilters = [...filters];
		if (!isNaN(filterIndex)) {
			newFilters[filterIndex].children = arrayMove(filters[filterIndex].children, oldIndex, newIndex);
		} else {
			newFilters = arrayMove(filters, oldIndex, newIndex);
		}
		this.setPrimitives(parentFilterId, newFilters);
	};

	onDeletePrimitive = ({parentFilterId, index, childIndex}) => {
		const primitives = this.getPrimitivesByFilterId(parentFilterId);
		let newPrimitives = [...primitives];
		if (!isNaN(childIndex)) {
			newPrimitives[index].children.splice(childIndex,1);
		} else {
			newPrimitives.splice(index, 1);
		}
		this.setPrimitives(parentFilterId, newPrimitives);
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

	onImportFilter = () => {
		const filter = this.getConvertedFilterSelector();
		filter.id = this.getNextFilterId();
		this.dispatchStoreAction({
			type: ActionTypes.ADD_NEW_FILTER_TO_TEMPLATE,
			payload: {filter: filter}
		});
		this.setConvertedFilter(null);
		this.addFilterIdToLayout(filter.id);
	};

	mergeImportedToData = (importedElement, primitive) => {
		Object.keys(primitive.params).forEach(paramName => {
			primitive.params[paramName].isIgnore = true;
		});
		importedElement.attributes && Object.keys(importedElement.attributes).forEach(attrName => {
			primitive.params[toCamelCaseString(attrName.replace(':','-'))] = {value: importedElement.attributes[attrName], isIgnore: false};
		});
	};

	mapPrimitive = (filter) => {
		const primitives = [];
		const primitivesNameList = this.getPrimitivesNamesListSelector();
		const filterObjElements = filter.elements.filter(el => el.type === 'element');
		filterObjElements.forEach(el => {
			const groupNameObj = primitivesNameList.find(p => p.name === el.name);
			if (groupNameObj) {
				const primitive = this.getFilterDataByGroupName(groupNameObj.groupName);
				primitive.id = (el.attributes && el.attributes.result) || primitive.groupName;
				this.mergeImportedToData(el, primitive);
				if (el.elements && primitive.children) {
					const primitivesChildrenNameList = this.getChildrenFiltersNamesList(groupNameObj);
					const childFilterObjElements = el.elements.filter(el => el.type === 'element');
					const {hasSingleChild} = primitivesAttrs[primitive.groupName];
					if (hasSingleChild) {
						primitive.children.forEach(childPrimitive => {
							childPrimitive.disabled = true;
						});
						childFilterObjElements.forEach(childEl => {
							const childGroupNameObj = primitivesChildrenNameList.find(p => p.name === childEl.name);
							if (childGroupNameObj) {
								primitive.children.forEach(p => {
									if (p.groupName === childGroupNameObj.groupName) {
										p.disabled = false;
										this.mergeImportedToData(childEl, p);
									}
								});
							}
						});
					} else {
						primitive.children = childFilterObjElements.map((childEl) => {
							const childGroupNameObj = primitivesChildrenNameList.find(p => p.name === childEl.name);
							const childPrimitive = this.getChildData(childGroupNameObj.groupName, primitive.groupName);
							childPrimitive.id = childEl.attributes && childEl.attributes.id;
							this.mergeImportedToData(childEl, childPrimitive);
							return childPrimitive;
						});
					}
				}
				primitives.push(primitive);
			}
		});
		return primitives;
	};

	mapFilterObj = (filterObj) => {
		if(!filterObj || !filterObj.elements || filterObj.elements.length > 1
			|| filterObj.elements[0].type !== 'element' || filterObj.elements[0].name !== 'filter'
			|| !filterObj.elements[0].elements || filterObj.elements[0].elements.length === 0) return false;
		const filter = filterObj.elements[0];
		const filterToReturn = this.createNewFilter();
		filterToReturn.name = 'imported filter';
		Object.keys(filterToReturn.params).forEach(paramName => {
			filterToReturn.params[paramName].isIgnore = true;
		});
		Object.keys(filter.attributes).forEach(attrName => {
			filterToReturn.params[attrName] = {value: filter.attributes[attrName], isIgnore: false};
		});

		filterToReturn.primitives = this.mapPrimitive(filter);
		return filterToReturn;
	};

	onConvert = (xml) => {
		try {
			const convert = require('xml-js');
			const result1 = convert.xml2json(xml, {compact: false, spaces: 4});
			const filterObj = JSON.parse(result1);
			const mappedFilter = this.mapFilterObj(filterObj);
			if (mappedFilter) {
				this.setConvertedFilter(mappedFilter);
			}
		} catch (e) {
			this.setConvertedFilter({Error: e.message});
		}
	};

	setConvertedFilter = (mappedFilter) => {
		this.dispatchStoreAction({
			type: ActionTypes.SET_CONVERTED_FILTER,
			payload: mappedFilter
		});
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
		return  filters.map(item => {
			const groupData = primitivesAttrs[item.groupName];
			if (item.groupName) {
				return  {name: groupData.name, groupName: item.groupName, id: item.id};
			}
			return {};
		});
	};

	getFilterDataByGroupName = (groupName) => {
		const filter = primitivesData.find(f => f.groupName === groupName);
		return filter ? JSON.parse(JSON.stringify(filter)) : {};
	};

	getChildData = (childGroupName, parentGroupName) => {
		const parentPrimitive = this.getFilterDataByGroupName(parentGroupName);
		const childPrimitive = parentPrimitive.children.find(c => c.groupName === childGroupName);
		return JSON.parse(JSON.stringify(childPrimitive));
	};

	getFiltersPresetsNames = () => {
		const filtersPresets = this.getFiltersPresetsSelector();
		return  filtersPresets.map(f => {
			return {
				name: f.name,
				id: f.id
			};
		});
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

	getConvertedFilterSelector = () => {
		return selectors.getConvertedFilterSelector(this.store.getState());
	}
}
