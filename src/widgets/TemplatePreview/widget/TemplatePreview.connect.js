import { connect } from 'react-redux';
import {getInstance} from 'sdk';
import TemplatePreviewComponent from './TemplatePreview.component';

const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
const templatePreviewApi = getInstance().TemplatePreviewApi;
const filtersApi = getInstance().FiltersApi;
const gradientsApi = getInstance().GradientsApi;
const mapStateToProps = (state, props) => {
	const {selectedLayout, selectedLayoutIndex} = editTemplateMainViewApi.getSelectedLayoutSelector();
	const product = editTemplateMainViewApi.getProductSelector();
	const template = editTemplateMainViewApi.getTemplateSelector();
	const scale = props.scale || editTemplateMainViewApi.getScaleSelector();
	const isSVGPathBuilderOpen = editTemplateMainViewApi.getIsSVGPathBuilderOpenSelector();
	const templateFilters = filtersApi.getTemplateFiltersSelector();
	const templateGradients = gradientsApi.getTemplateGradients();
	return {
		template,
		scale,
		product,
		isSVGPathBuilderOpen,
		selectedLayout,
		selectedLayoutIndex,
		templateFilters,
		editLayouts: props.editLayouts,
		templateGradients
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
