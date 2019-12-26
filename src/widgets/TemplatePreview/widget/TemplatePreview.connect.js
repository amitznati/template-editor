import { connect } from 'react-redux';
import {getInstance} from 'sdk';
import TemplatePreviewComponent from './TemplatePreview.component';

const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
const templatePreviewApi = getInstance().TemplatePreviewApi;
const filtersApi = getInstance().FiltersApi;
const mapStateToProps = () => {
	const {selectedLayout, selectedLayoutIndex} = editTemplateMainViewApi.getSelectedLayoutSelector();
	const product = editTemplateMainViewApi.getProductSelector();
	const template = editTemplateMainViewApi.getTemplateSelector();
	const scale = editTemplateMainViewApi.getScaleSelector();
	const isSVGPathBuilderOpen = editTemplateMainViewApi.getIsSVGPathBuilderOpenSelector();
	const templateFilters = filtersApi.getTemplateFiltersSelector();
	return {
		template,
		scale,
		product,
		isSVGPathBuilderOpen,
		selectedLayout,
		selectedLayoutIndex,
		templateFilters
	};
};

const mapDispatchToProps = () => ({
	onLayoutClick: editTemplateMainViewApi.onLayoutClick,
	onUpdateLayout: editTemplateMainViewApi.onUpdateLayout,
	onEditLayoutEnd: editTemplateMainViewApi.onEditLayoutEnd,
	onPathChange: templatePreviewApi.onPathChange

});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TemplatePreviewComponent);
