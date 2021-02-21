import { ActionTypes } from './EditTemplateMainViewApi';
import { defaultTheme, defaultLogo } from '../defaults';

const initialState = {
  template: { templateGradients: [], templateFilters: [], layouts: [] },
  selectedLayout: { selectedLayout: null, selectedLayoutIndex: -1 },
  isAddLayoutDialogOpen: false,
  scale: 0.5,
  allFontsLoaded: false,
  isSVGPathBuilderOpen: false,
  templateGradients: [],
  dynamicImageOptions: [],
  uploadedFonts: [],
  uploadedImages: [],
  selectedTheme: defaultTheme,
  selectedLogo: defaultLogo,
  product: {
    id: 1,
    name: '',
    image: '',
    size: { height: 30, width: 20 },
    templateFrame: {
      height: 25,
      width: 18.5,
      x: 0.5,
      y: 1.1
    },
    dynamicTextOptions: [],
    dynamicColorOptions: [],
    dynamicFontOptions: [],
    googleFontAPIKey: ''
  }
};
// const SUCCESS = '_SUCCESS';
const reducer = (state = initialState, action) => {
  let newState = { ...state };
  const payload = action && action.payload;
  const type = action && action.type;
  switch (type) {
    case ActionTypes.UPDATE_SELECTED_LAYOUT:
      newState = { ...state, selectedLayout: { ...payload } };
      break;
    case ActionTypes.UPDATE_TEMPLATE:
      newState = { ...state, template: { ...payload } };
      break;
    case ActionTypes.UPDATE_TEMPLATE_GRADIENTS:
      newState = {
        ...state,
        template: { ...state.template, templateGradients: [...payload] }
      };
      break;
    case ActionTypes.UPDATE_TEMPLATE_FILTERS:
      newState = {
        ...state,
        template: { ...state.template, templateFilters: [...payload] }
      };
      break;
    case ActionTypes.TOGGLE_ADD_LAYOUT_DIALOG:
      newState = { ...state, isAddLayoutDialogOpen: payload };
      break;
    case ActionTypes.EDIT_LAYOUT_END:
      newState = {
        ...state,
        selectedLayout: { selectedLayout: null, selectedLayoutIndex: -1 },
        isSVGPathBuilderOpen: false
      };
      break;
    case ActionTypes.TOGGLE_SVG_PATH_BUILDER_OPEN:
      newState = {
        ...state,
        isSVGPathBuilderOpen: !state.isSVGPathBuilderOpen
      };
      break;
    case ActionTypes.UPDATE_SCALE:
      newState = { ...state, scale: payload };
      break;
    case ActionTypes.SET_INITIAL_DATA:
      newState = { ...state, ...payload };
      break;
    case ActionTypes.SET_ALL_FONTS_LOADED:
      newState = { ...state, allFontsLoaded: true };
      break;
    case ActionTypes.RESET_STATE:
      newState = initialState;
      break;
    default:
      return newState;
  }
  return newState;
};

export default reducer;
