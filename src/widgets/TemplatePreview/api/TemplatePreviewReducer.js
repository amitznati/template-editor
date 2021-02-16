import { ActionTypes } from './TemplatePreviewApi';
const initialState = { isNodeRefreshRequire: false };
const reducer = (state = initialState, action) => {
  let newState = { ...state };
  const payload = action && action.payload;
  const type = action && action.type;
  switch (type) {
    case ActionTypes.SET_IS_NODE_REFRESH_REQUIRE:
      newState = {
        ...state,
        isNodeRefreshRequire: payload
      };
      break;
    default:
      return newState;
  }
  return newState;
};

export default reducer;
