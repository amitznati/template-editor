import BaseApi from '../../../sdk/BaseApi';

export const ActionTypes = {};

const gradientTemplate = {
  id: 'gradient-0',
  name: 'gradient',
  gradientData: {
    gradientType: 'Linear',
    StartX: 0.5,
    StartY: 0.5,
    EndX: 0.5,
    EndY: 0.1,
    palette: [
      { pos: 0, color: 'rgba(255,0,18,1)' },
      { pos: 1, color: 'rgba(30,0,255,1)' }
    ],
    activeId: 1,
    isActive: false,
    Angle: 0,
    EndRadius: 0.5,
    spreadMethod: 'pad'
  }
};

export default class GradientsApi extends BaseApi {
  updateTemplateGradients = (gradients) => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    editTemplateMainViewApi.updateTemplateGradients(gradients);
  };

  getSelectedGradientId = () => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const {
      selectedLayout
    } = editTemplateMainViewApi.getSelectedLayoutSelector();
    return selectedLayout.properties.fill.gradientId;
  };

  getTemplateGradients = () => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    return editTemplateMainViewApi.getTemplateGradientsSelector();
  };

  getSelectedGradientSelector = () => {
    const templateGradients = this.getTemplateGradients();
    const selectedGradientId = this.getSelectedGradientId();
    return templateGradients.find((g) => g.id === selectedGradientId);
  };

  updateSelectedGradient = (newValues) => {
    const templateGradients = this.getTemplateGradients();
    const selectedGradientId = this.getSelectedGradientId();
    templateGradients.forEach((g) => {
      if (g.id === selectedGradientId) {
        if (newValues.gradientData) {
          g.gradientData = newValues.gradientData;
        } else if (newValues.name) {
          g.name = newValues.name;
        }
      }
    });
    this.updateTemplateGradients(templateGradients);
  };

  removeGradientFromLayout = () => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const {
      selectedLayout
    } = editTemplateMainViewApi.getSelectedLayoutSelector();
    selectedLayout.properties.fill = {
      ...selectedLayout.properties.fill,
      fill: '',
      gradientId: null
    };
    editTemplateMainViewApi.onUpdateLayout(selectedLayout);
  };

  removeGradientFromTemplate = (item) => {
    const templateGradients = this.getTemplateGradients();
    const newGradients = templateGradients.filter((g) => g.id !== item.id);
    this.updateTemplateGradients(newGradients);
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const template = editTemplateMainViewApi.getTemplateSelector();
    template.layouts.forEach((selectedLayout) => {
      if (selectedLayout.properties.fill.gradientId === item.id) {
        selectedLayout.properties.fill = {
          ...selectedLayout.properties.fill,
          fill: '',
          gradientId: null
        };
      }
    });
    editTemplateMainViewApi.updateTemplate(template);
  };

  getNextGradientId = () => {
    const templateGradients = this.getTemplateGradients();
    let nextIdNumber = 1;
    templateGradients.forEach((g) => {
      if (g.id.includes('gradient-')) {
        const idNumber = Number(g.id.replace('gradient-', ''));
        if (idNumber >= nextIdNumber) {
          nextIdNumber = idNumber + 1;
        }
      }
    });
    return `gradient-${nextIdNumber}`;
  };

  createNewGradient = () => {
    const newGradient = JSON.parse(JSON.stringify(gradientTemplate));
    newGradient.id = this.getNextGradientId();
    newGradient.name = `${newGradient.id}`;
    return newGradient;
  };

  onGradientNameChange = (newName) => {
    this.updateSelectedGradient({ name: newName });
  };

  addNewGradientToTemplate = (gradient) => {
    const templateGradients = this.getTemplateGradients();
    templateGradients.push(gradient);
    this.updateTemplateGradients(templateGradients);
  };

  onAddGradient = (item) => {
    let gradient;
    if (item.id === 'new') {
      gradient = this.createNewGradient();
      this.addNewGradientToTemplate(gradient);
    } else {
      gradient = this.getTemplateGradients().find((g) => g.id === item.id);
    }
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const {
      selectedLayout
    } = editTemplateMainViewApi.getSelectedLayoutSelector();
    selectedLayout.properties.fill = {
      ...selectedLayout.properties.fill,
      fill: `url(#${gradient.id})`,
      gradientId: gradient.id
    };
    editTemplateMainViewApi.onUpdateLayout(selectedLayout);
  };

  onGradientChange = (data) => {
    const { palette } = data;
    const layoutPalette = [];
    palette.map((p) => {
      layoutPalette.push({ pos: Number(p.pos), color: p.color });
      return false;
    });
    const gradientData = { ...data, palette: layoutPalette };
    this.updateSelectedGradient({ gradientData });
  };

  selectGradientOptionsSelector = () => {
    const templateGradients = this.getTemplateGradients();
    const gradientOptions = templateGradients.map((g) => {
      return { name: g.name, id: g.id };
    });
    gradientOptions.unshift({ name: 'New Gradient...', id: 'new' });
    return gradientOptions;
  };
}
