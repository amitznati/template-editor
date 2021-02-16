import BaseApi from '../../../sdk/BaseApi';
import { getPX } from '../../../sdk/utils';
export default class LayoutsListApi extends BaseApi {
  onAlignmentClick = (alignment, value) => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const {
      selectedLayout: layout,
      selectedLayoutIndex
    } = editTemplateMainViewApi.getSelectedLayoutSelector();
    const product = editTemplateMainViewApi.getProductSelector();
    const { templateFrame } = product;
    const templateH = getPX(templateFrame.height);
    const templateW = getPX(templateFrame.width);
    const newLayout = { ...layout };
    if (['text'].includes(layout.type)) {
      this.handleTextAlignment(
        alignment,
        value,
        templateH,
        newLayout,
        templateW
      );
    } else if (['image', 'customSVG', 'logo'].includes(layout.type)) {
      this.handleImageAlignment(
        alignment,
        value,
        templateH,
        newLayout,
        templateW,
        selectedLayoutIndex,
        layout.type
      );
    } else if (['textPath'].includes(layout.type)) {
      this.handleTextPathAlignment(
        alignment,
        value,
        templateH,
        newLayout,
        templateW,
        selectedLayoutIndex
      );
    }
    editTemplateMainViewApi.onUpdateLayout(newLayout);
    this.apis.TemplatePreviewApi.setIsNodeRefreshRequire(true);
  };

  handleTextAlignment(alignment, value, templateH, newLayout, templateW) {
    this.handleTextVerticalAlignment(alignment, value, templateH, newLayout);
    if (alignment === 'horizontal') {
      let translateX;
      let alignmentAttributes;
      switch (value) {
        case 'left':
          translateX = 0;
          alignmentAttributes = 'start';
          break;
        case 'right':
          translateX = templateW;
          alignmentAttributes = 'end';
          break;
        case 'center':
          translateX = templateW / 2;
          alignmentAttributes = 'middle';
          break;
        default:
          break;
      }
      newLayout.properties.transform.translateX = translateX;
      newLayout.properties.alignment = {
        ...newLayout.properties.alignment,
        horizontal: { value, alignmentAttributes, align: true }
      };
    }
  }

  handleImageAlignment = (
    alignment,
    value,
    templateH,
    newLayout,
    templateW,
    selectedLayoutIndex,
    type
  ) => {
    const imageRect = document
      .getElementById(`${type}_${selectedLayoutIndex}`)
      .getBBox();
    const {
      properties: {
        transform: { scaleX, scaleY }
      }
    } = newLayout;
    const imageH = imageRect.height * scaleY;
    const imageW = imageRect.width * scaleX;

    if (alignment === 'vertical') {
      let translateY;
      switch (value) {
        case 'top':
          translateY = 0;
          break;
        case 'bottom':
          translateY = templateH - imageH;
          break;
        case 'center':
          translateY = templateH / 2 - imageH / 2;
          break;
        default:
          break;
      }
      newLayout.properties.transform.translateY = translateY;
      newLayout.properties.alignment = {
        ...newLayout.properties.alignment,
        vertical: { value, align: true }
      };
    }
    this.handleRectHorizontalAlignment(
      alignment,
      value,
      templateW,
      imageW,
      newLayout
    );
  };

  handleTextPathAlignment = (
    alignment,
    value,
    templateH,
    newLayout,
    templateW,
    selectedLayoutIndex
  ) => {
    const imageRect = document
      .getElementById(`textPath_${selectedLayoutIndex}`)
      .getBBox();
    const {
      properties: {
        transform: { scaleX }
      }
    } = newLayout;
    const imageW = imageRect.width * scaleX;

    this.handleTextVerticalAlignment(alignment, value, templateH, newLayout);
    this.handleRectHorizontalAlignment(
      alignment,
      value,
      templateW,
      imageW,
      newLayout
    );
  };

  handleTextVerticalAlignment(alignment, value, templateH, newLayout) {
    if (alignment === 'vertical') {
      let translateY;
      let alignmentAttributes;
      switch (value) {
        case 'top':
          translateY = 0;
          alignmentAttributes = 'text-before-edge';
          break;
        case 'bottom':
          translateY = templateH;
          alignmentAttributes = 'text-after-edge';
          break;
        case 'center':
          translateY = templateH / 2;
          alignmentAttributes = 'middle';
          break;
        default:
          break;
      }
      newLayout.properties.transform.translateY = translateY;
      newLayout.properties.alignment = {
        ...newLayout.properties.alignment,
        vertical: { value, alignmentAttributes, align: true }
      };
    }
  }

  handleRectHorizontalAlignment(
    alignment,
    value,
    templateW,
    imageW,
    newLayout
  ) {
    if (alignment === 'horizontal') {
      let translateX;
      switch (value) {
        case 'left':
          translateX = 0;
          break;
        case 'right':
          translateX = templateW - imageW;
          break;
        case 'center':
          translateX = templateW / 2 - imageW / 2;
          break;
        default:
          break;
      }
      newLayout.properties.transform.translateX = translateX;
      newLayout.properties.alignment = {
        ...newLayout.properties.alignment,
        horizontal: { value, align: true }
      };
    }
  }

  onFullSizeClick = (dir) => {
    const editTemplateMainViewApi = this.apis.EditTemplateMainViewApi;
    const {
      selectedLayout: layout
    } = editTemplateMainViewApi.getSelectedLayoutSelector();
    const newLayout = { ...layout };
    if (dir === 'height') {
      newLayout.properties.transform.translateY = 0;
      newLayout.properties.transform.scaleY = 1;
      newLayout.properties.fullSizeProperties = {
        ...newLayout.properties.fullSizeProperties,
        height: '100%',
        preserveAspectRatio: 'none'
      };
    } else if (dir === 'width') {
      newLayout.properties.transform.translateX = 0;
      newLayout.properties.transform.scaleX = 1;
      newLayout.properties.fullSizeProperties = {
        ...newLayout.properties.fullSizeProperties,
        width: '100%',
        preserveAspectRatio: 'none'
      };
    }
    editTemplateMainViewApi.onUpdateLayout(newLayout);
    this.apis.TemplatePreviewApi.setIsNodeRefreshRequire(true);
  };
}
