import { connect } from 'react-redux';
import {getInstance} from '../../../sdk';
import FiltersComponent from './Filters.component';

const filtersApi = getInstance().FiltersApi;

const mapStateToProps = () => {
	return {
		presetsNames: filtersApi.getFiltersPresetsNames(),
		primitivesNameList: filtersApi.getPrimitivesNamesListSelector(),
		templateFiltersNamesList: filtersApi.getFiltersTemplateNames(),
		layoutFilters: filtersApi.getLayoutFiltersSelector(),
	};
};

const mapDispatchToProps = () => ({
	onAddFilter: filtersApi.onAddFilter,
	onDeleteFilter: filtersApi.onDeleteFilter,
	onAttributeChange: filtersApi.onAttributeChange,
	onSortEnd: filtersApi.onSortEnd,
	getChildrenFiltersNamesList: filtersApi.getChildrenFiltersNamesList,
	onAddChildFilter: filtersApi.onAddChildFilter,
	onAddParentFilter: filtersApi.onAddParentFilter,
	onAddFilterFromPresets: filtersApi.onAddFilterFromPresets
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FiltersComponent);
