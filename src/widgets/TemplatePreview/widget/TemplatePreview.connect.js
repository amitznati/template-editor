import { connect } from 'react-redux';
import {getInstance} from '../../../sdk';
import TemplatePreviewComponent from './TemplatePreview.component';

const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;

const mapStateToProps = () => {
	const {selectedLayout, selectedLayoutIndex} = editTemplateMainViewApi.getSelectedLayoutSelector();
	const product = editTemplateMainViewApi.getProductSelector();
	const template = editTemplateMainViewApi.getTemplateSelector();
	const scale = editTemplateMainViewApi.getScaleSelector();
	const isSVGPathBuilderOpen = editTemplateMainViewApi.getIsSVGPathBuilderOpenSelector();
	return {
		template,
		scale,
		product,
		isSVGPathBuilderOpen,
		selectedLayout,
		selectedLayoutIndex
	};
};

const mapDispatchToProps = () => ({
	onLayoutClick: editTemplateMainViewApi.onLayoutClick,
	onUpdateLayout: editTemplateMainViewApi.onUpdateLayout,
	onEditLayoutEnd: editTemplateMainViewApi.onEditLayoutEnd,

});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TemplatePreviewComponent);
