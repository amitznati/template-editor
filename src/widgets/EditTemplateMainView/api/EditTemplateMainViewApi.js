import BaseApi from '../../../sdk/BaseApi';
import selectors from './EditTemplateMainViewSelectors';
import arrayMove from 'array-move';
import { getPX } from '../../../sdk/utils';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

export const ActionTypes = {
  UPDATE_SELECTED_LAYOUT: 'UPDATE_SELECTED_LAYOUT',
  UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
  TOGGLE_ADD_LAYOUT_DIALOG: 'TOGGLE_ADD_LAYOUT_DIALOG',
  EDIT_LAYOUT_END: 'EDIT_LAYOUT_END',
  TOGGLE_SVG_PATH_BUILDER_OPEN: 'TOGGLE_SVG_PATH_BUILDER_OPEN',
  UPDATE_SCALE: 'UPDATE_SCALE',
  SET_ALL_FONTS_LOADED: 'SET_ALL_FONTS_LOADED',
  UPDATE_TEMPLATE_GRADIENTS: 'UPDATE_TEMPLATE_GRADIENTS',
  UPDATE_TEMPLATE_FILTERS: 'UPDATE_TEMPLATE_FILTERS',
  SET_INITIAL_DATA: 'SET_INITIAL_DATA',
  RESET_STATE: 'RESET_STATE'
};
const getDefaultProperties = (axis) => {
  return {
    x: 0,
    y: 0,
    transform: {
      translateY: getPX(axis.y),
      translateX: getPX(axis.x),
      scaleX: 1,
      scaleY: 1
    },
    filters: []
  };
};

const getDefaultFontProps = (templateWidth) => {
  return {
    fontSize: templateWidth * 8,
    fontFamily: 'Raleway',
    fontStyle: 'normal',
    fontWeight: '300',
    fontProvider: 'google'
  };
};
const getDefaultColorProps = () => {
  return {
    strokeWidth: 0,
    stroke: '',
    fill: { fill: 'black' },
    themeColor: ''
  };
};

const layoutsTemplate = (type, payload, product, selectedLogo) => {
  const x1 = 0;
  const y1 = product.templateFrame.height / 2;
  const defaultProperties = getDefaultProperties({ x: x1, y: y1 });
  const defaultFontProps = getDefaultFontProps(product.templateFrame.width);
  const defaultColorProps = getDefaultColorProps();
  switch (type) {
    case 'image':
      return {
        type: 'image',
        properties: {
          ...payload,
          ...defaultProperties
        }
      };
    case 'text':
      return {
        type: 'text',
        properties: {
          ...payload,
          ...defaultProperties,
          ...defaultFontProps,
          ...defaultColorProps
        }
      };
    case 'textPath': {
      const x = getPX(x1);
      const addWidth = getPX(product.templateFrame.width);
      return {
        type: 'textPath',
        properties: {
          ...payload,
          ...defaultProperties,
          ...defaultFontProps,
          ...defaultColorProps,
          pathData: {
            path: `M ${x} 0 L ${x + addWidth} 0`,
            points: [
              { x, y: 0 },
              { x: x + addWidth, y: 0 }
            ],
            closePath: false
          }
        }
      };
    }
    case 'customSVG': {
      return {
        type: 'customSVG',
        properties: {
          src: payload,
          ...defaultProperties,
          ...defaultColorProps
        }
      };
    }
    case 'logo':
      return {
        type: 'logo',
        properties: {
          template: JSON.parse(JSON.stringify(selectedLogo.template)),
          ...defaultProperties
        }
      };
    default:
      return '';
  }
};

export default class EditTemplateMainViewApi extends BaseApi {
  updateTemplate = (template) => {
    this.dispatchStoreAction({
      type: ActionTypes.UPDATE_TEMPLATE,
      payload: template
    });
  };

  toggleAddLayoutDialog = (isOpen) => {
    const payload = !!isOpen;
    if (payload) {
      this.onEditLayoutEnd();
    }
    this.dispatchStoreAction({
      type: ActionTypes.TOGGLE_ADD_LAYOUT_DIALOG,
      payload
    });
  };

  updateTemplateGradients = (gradients) => {
    this.dispatchStoreAction({
      type: ActionTypes.UPDATE_TEMPLATE_GRADIENTS,
      payload: gradients
    });
  };

  getTemplateGradientsSelector = () => {
    return selectors.templateGradientsSelector(this.store.getState());
  };

  updateTemplateFilters = (filters) => {
    this.dispatchStoreAction({
      type: ActionTypes.UPDATE_TEMPLATE_FILTERS,
      payload: [...filters]
    });
  };

  getTemplateFiltersSelector = () => {
    return selectors.templateFiltersSelector(this.store.getState());
  };

  onLayoutClick = (index) => {
    const { layouts } = this.getTemplateSelector();
    this.dispatchStoreAction({
      type: ActionTypes.UPDATE_SELECTED_LAYOUT,
      payload: { selectedLayout: layouts[index], selectedLayoutIndex: index }
    });
  };

  onDeleteLayout = (index) => {
    const template = this.getTemplateSelector();
    template.layouts.splice(index, 1);
    this.updateTemplate(template);
  };

  onDuplicateLayout = (index) => {
    const template = this.getTemplateSelector();
    const duplicateLayout = JSON.parse(JSON.stringify(template.layouts[index]));
    template.layouts.push(duplicateLayout);
    this.updateTemplate(template);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const template = this.getTemplateSelector();
    template.layouts = arrayMove(template.layouts, oldIndex, newIndex);
    this.updateTemplate(template);
  };

  handleAddClose = ({ type, value }) => {
    if (!type) {
      this.toggleAddLayoutDialog(false);
      this.onEditLayoutEnd();
      return;
    }
    const product = this.getProductSelector();
    const template = this.getTemplateSelector();
    const logo = this.getSelectedLogoSelector();
    const newLayout = JSON.parse(
      JSON.stringify(layoutsTemplate(type, value, product, logo))
    );
    template.layouts.push(newLayout);
    this.toggleAddLayoutDialog(false);
    this.updateTemplate(template);
    const toId = setTimeout(
      () => {
        this.onLayoutClick(template.layouts.length - 1);
        clearTimeout(toId);
      },
      newLayout.type === 'logo' ? 300 : 10
    );
  };

  onUpdateLayout = (layout) => {
    const template = this.getTemplateSelector();
    const { selectedLayoutIndex } = this.getSelectedLayoutSelector();
    template.layouts[selectedLayoutIndex] = layout;
    this.updateTemplate(template);
    this.apis.TemplatePreviewApi.setIsNodeRefreshRequire(true);
  };

  saveTemplate = () => {
    // mockService('templates','create',this.state.template);
  };

  onEditLayoutEnd = () => {
    this.dispatchStoreAction({
      type: ActionTypes.EDIT_LAYOUT_END
    });
  };

  setIgnoreLayout = (index) => {
    const template = this.getTemplateSelector();
    template.layouts[index].isIgnore = !template.layouts[index].isIgnore;
    this.updateTemplate(template);
  };

  getAllFonts = () => {
    const template = this.getTemplateSelector();
    const { layouts = [] } = template;
    const allFonts = [];
    layouts.forEach((l) => {
      const { fontFamily, fontStyle, fontWeight } = l.properties;
      if (l.type === 'text' || l.type === 'textPath') {
        allFonts.push(
          `${fontFamily}:${fontWeight || 300}${fontStyle || 'normal'}`
        );
      }
    });
    return allFonts;
  };

  onTogglePathBuilder = () => {
    this.dispatchStoreAction({
      type: ActionTypes.TOGGLE_SVG_PATH_BUILDER_OPEN
    });
  };

  updateScale = (scale) => {
    this.dispatchStoreAction({
      type: ActionTypes.UPDATE_SCALE,
      payload: scale
    });
  };

  resetState = () => {
    this.dispatchStoreAction({
      type: ActionTypes.RESET_STATE
    });
  };

  setAllFontsLoaded = () => {
    this.dispatchStoreAction({
      type: ActionTypes.SET_ALL_FONTS_LOADED
    });
  };

  getTemplateSelector = () => {
    return selectors.getTemplateSelector(this.store.getState());
  };

  getSelectedLayoutSelector = () => {
    return selectors.getSelectedLayoutSelector(this.store.getState());
  };

  getIsSVGPathBuilderOpenSelector = () => {
    return selectors.getIsSVGPathBuilderOpenSelector(this.store.getState());
  };

  getProductSelector = () => {
    return selectors.getProductSelector(this.store.getState());
  };

  setInitialData = (initialData) => {
    this.dispatchStoreAction({
      type: ActionTypes.SET_INITIAL_DATA,
      payload: initialData
    });
  };

  getScaleSelector = () => {
    return selectors.getScaleSelector(this.store.getState());
  };

  getDynamicImageOptionsSelector = () => {
    return selectors.getDynamicImageOptionsSelector(this.store.getState());
  };

  getDynamicColorOptionsSelector = () => {
    return selectors.getDynamicColorOptionsSelector(this.store.getState());
  };

  getDynamicFontOptionsSelector = () => {
    return selectors.getDynamicFontOptionsSelector(this.store.getState());
  };

  isAddLayoutDialogOpenSelector = () => {
    return selectors.isAddLayoutDialogOpenSelector(this.store.getState());
  };

  isAllFontLoadedSelector = () => {
    return selectors.isAllFontLoadedSelector(this.store.getState());
  };

  getUploadedFontsSelector = () => {
    return selectors.getUploadedFontsSelector(this.store.getState());
  };

  getUploadedImagesSelector = () => {
    return selectors.getUploadedImagesSelector(this.store.getState());
  };

  getSelectedThemeSelector = () => {
    return selectors.getSelectedThemeSelector(this.store.getState());
  };

  getSelectedLogoSelector = () => {
    return selectors.getSelectedLogoSelector(this.store.getState());
  };
}
