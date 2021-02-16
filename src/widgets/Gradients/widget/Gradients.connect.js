import { connect } from 'react-redux';
import { getInstance } from '../../../sdk';
import GradientsComponent from './Gradients.component';

const gradientsApi = getInstance().GradientsApi;
const {
  selectGradientOptionsSelector,
  getSelectedGradientSelector,
  onAddGradient,
  onGradientChange,
  removeGradientFromLayout,
  removeGradientFromTemplate,
  onGradientNameChange
} = gradientsApi;
const mapStateToProps = () => {
  return {
    selectGradientOptions: selectGradientOptionsSelector(),
    selectedGradient: getSelectedGradientSelector()
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
