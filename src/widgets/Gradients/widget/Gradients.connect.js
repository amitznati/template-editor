import { connect } from 'react-redux';
import { getInstance } from '../../../sdk';
import GradientsComponent from './Gradients.component';

const gradientsApi = getInstance().GradientsApi;
const editTemplateMainViewApi = getInstance().EditTemplateMainViewApi;
const {
  selectGradientOptionsSelector,
  getSelectedGradientSelector,
  onAddGradient,
  onGradientChange,
  removeGradientFromLayout,
  removeGradientFromTemplate,
  onGradientNameChange,
} = gradientsApi;
const mapStateToProps = () => {
  return {
    selectGradientOptions: selectGradientOptionsSelector(),
    selectedGradient: getSelectedGradientSelector(),
    dynamicColorOptions: editTemplateMainViewApi.getDynamicColorOptionsSelector()
  };
};

const mapDispatchToProps = () => ({
  onAddGradient,
  onGradientChange,
  removeGradientFromLayout,
  removeGradientFromTemplate,
  onGradientNameChange
});

export default connect(mapStateToProps, mapDispatchToProps)(GradientsComponent);
