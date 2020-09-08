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
  SET_PRODUCT: 'SET_PRODUCT'
};
const getDefaultProperties = (axis) => {
  return { x: axis.x, y: axis.y, transform: {}, filters: [] };
};

const getDefaultFontProps = (templateWidth) => {
  return {
    fontSize: templateWidth * 8,
    fontFamily: 'Raleway',
    fontStyle: 'normal',
    fontWeight: '300'
  };
};

const layoutsTemplate = (type, payload, product) => {
  const x1 = 0;
  const y1 = product.templateFrame.height / 2;
  const defaultProperties = getDefaultProperties({ x: x1, y: y1 });
  const defaultFontProps = getDefaultFontProps(product.templateFrame.width);
  switch (type) {
    case 'image':
      return {
        type: 'image',
        properties: {
          src: payload.url,
          ...defaultProperties
        }
      };
    case 'text':
      return {
        type: 'text',
        properties: {
          text: payload,
          ...defaultProperties,
          ...defaultFontProps,
          strokeWidth: 0,
          stroke: '',
          fill: { fill: 'black' }
        }
      };
    case 'textPath': {
      const x = getPX(x1);
      const y = getPX(y1);
      const addWidth = getPX(product.templateFrame.width);
      return {
        type: 'textPath',
        properties: {
          text: payload,
          ...defaultProperties,
          ...defaultFontProps,
          fill: { fill: 'black' },
          strokeWidth: 0,
          stroke: '',
          pathData: {
            path: `M ${x} ${y} L ${x + addWidth} ${y}`,
            points: [
              { x, y },
              { x: x + addWidth, y }
            ],
            closePath: false
          }
        }
      };
    }
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const template = this.getTemplateSelector();
    const newLayouts = arrayMove(template.layouts, oldIndex, newIndex);
    template.layouts = newLayouts;
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
    const newLayout = JSON.parse(
      JSON.stringify(layoutsTemplate(type, value, product))
    );
    template.layouts.push(newLayout);
    this.toggleAddLayoutDialog(false);
    this.onLayoutClick(template.layouts.length - 1);
    this.updateTemplate(template);
  };

  onUpdateLayout = (layout) => {
    const template = this.getTemplateSelector();
    const { selectedLayoutIndex } = this.getSelectedLayoutSelector();
    template.layouts[selectedLayoutIndex] = layout;
    this.updateTemplate(template);
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

  setProduct = (product) => {
    this.dispatchStoreAction({
      type: ActionTypes.SET_PRODUCT,
      payload: product
    });
  };

  getScaleSelector = () => {
    return selectors.getScaleSelector(this.store.getState());
  };

  isAddLayoutDialogOpenSelector = () => {
    return selectors.isAddLayoutDialogOpenSelector(this.store.getState());
  };

  isAllFontLoadedSelector = () => {
    return selectors.isAllFontLoadedSelector(this.store.getState());
  };
}
