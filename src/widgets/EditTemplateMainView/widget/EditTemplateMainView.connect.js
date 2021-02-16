import { connect } from 'react-redux';
import { getInstance } from '../../../sdk';
import EditTemplateMainViewComponent from './EditTemplateMainView.component';

const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;

const mapStateToProps = (state, props) => {
  const scale = editTemplateMainViewApi.getScaleSelector();
  const isAddLayoutDialogOpen = editTemplateMainViewApi.isAddLayoutDialogOpenSelector();
  const allFonts = editTemplateMainViewApi.getAllFonts();
  const allFontsLoaded = editTemplateMainViewApi.isAllFontLoadedSelector();
  const template = editTemplateMainViewApi.getTemplateSelector();
  return {
    scale,
    isAddLayoutDialogOpen,
    allFonts,
    allFontsLoaded,
    template,
    ...props
  };
};

const mapDispatchToProps = () => ({
  onTogglePathBuilder: editTemplateMainViewApi.onTogglePathBuilder,
  toggleAddLayoutDialog: editTemplateMainViewApi.toggleAddLayoutDialog,
  updateScale: editTemplateMainViewApi.updateScale,
  handleAddClose: editTemplateMainViewApi.handleAddClose,
  saveTemplate: editTemplateMainViewApi.saveTemplate,
  setAllFontsLoaded: editTemplateMainViewApi.setAllFontsLoaded,
  setInitialData: editTemplateMainViewApi.setInitialData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTemplateMainViewComponent);
