import { connect } from 'react-redux';
import { getInstance } from '../../../sdk';
import LayoutsListComponent from './LayoutsList.component';

const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
const layoutListApi = getInstance().LayoutsListApi;
const mapStateToProps = (state) => {
  const {
    selectedLayout
  } = editTemplateMainViewApi.getSelectedLayoutSelector();
  const template = editTemplateMainViewApi.getTemplateSelector();
  const isSVGPathBuilderOpen = editTemplateMainViewApi.getIsSVGPathBuilderOpenSelector();
  const dynamicTextOptions = editTemplateMainViewApi.getProductSelector()
    .dynamicTextOptions;
  const uploadedFonts = editTemplateMainViewApi.getUploadedFontsSelector();
  return {
    selectedLayout,
    template,
    layouts: template.layouts,
    isSVGPathBuilderOpen,
    dynamicTextOptions,
    uploadedFonts,
    googleFontAPIKey: state?.EditTemplateMainView?.googleFontAPIKey
  };
};

const mapDispatchToProps = () => ({
  onTogglePathBuilder: editTemplateMainViewApi.onTogglePathBuilder,
  onLayoutClick: editTemplateMainViewApi.onLayoutClick,
  onUpdateLayout: editTemplateMainViewApi.onUpdateLayout,
  onBack: editTemplateMainViewApi.onEditLayoutEnd,
  onDeleteLayout: editTemplateMainViewApi.onDeleteLayout,
  onSortEnd: editTemplateMainViewApi.onSortEnd,
  setIgnoreLayout: editTemplateMainViewApi.setIgnoreLayout,
  onDuplicateLayout: editTemplateMainViewApi.onDuplicateLayout,
  onAlignmentClick: layoutListApi.onAlignmentClick,
  onFullSizeClick: layoutListApi.onFullSizeClick
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutsListComponent);
