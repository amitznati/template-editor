import { createSelector } from 'reselect';
import config from './TemplatePreviewConfig';

const sliceSelector = (state) => state[config.sliceName];

export const isNodeRefreshRequireSelector = createSelector(
  sliceSelector,
  (slice) => {
    return slice.isNodeRefreshRequire;
  }
);

export default {
  isNodeRefreshRequireSelector
};
