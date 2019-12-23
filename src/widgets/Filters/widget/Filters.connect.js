import { connect } from 'react-redux';
import {getInstance} from '../../../sdk';
import FiltersComponent from './Filters.component';

const filtersApi = getInstance().FiltersApi;

const mapStateToProps = () => {
	return {
		filtersNameList: filtersApi.getFiltersNamesListSelector(),
		filters: filtersApi.getFiltersSelector()
	};
};

const mapDispatchToProps = () => ({
	onAddFilter: filtersApi.onAddFilter,
	onDeleteFilter: filtersApi.onDeleteFilter,
	onAttributeChange: filtersApi.onAttributeChange,
	onSortEnd: filtersApi.onSortEnd,
	getChildrenFiltersNamesList: filtersApi.getChildrenFiltersNamesList,
	onAddChildFilter: filtersApi.onAddChildFilter,
	onAddParentFilter: filtersApi.onAddParentFilter
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FiltersComponent);
