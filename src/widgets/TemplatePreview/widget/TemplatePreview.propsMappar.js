import { getPX } from '../../../sdk/utils';

export const mapComponentProps = (props) => {
  const {
    template = {},
    scale,
    product,
    isSVGPathBuilderOpen,
    selectedLayout,
    onEditLayoutEnd,
    selectedLayoutIndex,
    onLayoutClick,
    onUpdateLayout,
    onPathChange,
    selectedTheme,
    editLayouts = [],
    previewOnly = false,
    isThemeActive = true,
    isNodeRefreshRequire,
    setIsNodeRefreshRequire,
    dynamicTextValues = [],
    isActiveTextValues = false,
    selectedLogo
  } = props;
  if (template.layouts.length && selectedLogo) {
    template.layouts.forEach((layout) => {
      if (layout.type === 'logo') {
        layout.properties.template = selectedLogo.template;
      }
    });
  }
  if (isThemeActive && selectedTheme) {
    replaceDynamicThemeValues(template, selectedTheme);
  }
  if (isActiveTextValues) {
    replaceDynamicTextValues(template, dynamicTextValues);
  }
  const {
    layouts = [],
    templateFilters = [],
    templateGradients = []
  } = template;
  const allFonts = getAllFonts(template);
  return {
    layouts: layouts.concat(editLayouts),
    productH: getPX(product.size.height, scale),
    productW: getPX(product.size.width, scale),
    templateH: getPX(product.templateFrame.height, scale),
    templateW: getPX(product.templateFrame.width, scale),
    templateX: getPX(product.templateFrame.x, scale),
    templateY: getPX(product.templateFrame.y, scale),
    product,
    previewOnly,
    allFonts,
    DefsProps: {
      templateFilters,
      templateGradients
    },
    logoProps: {
      h: getPX(product.templateFrame.height),
      w: getPX(product.templateFrame.width)
    },
    SVGStylesProps: {
      allFonts
    },
    SVGRootProps: {
      onEditLayoutEnd,
      selectedLayoutIndex,
      onLayoutClick,
      onUpdateLayout,
      h: getPX(product.templateFrame.height),
      w: getPX(product.templateFrame.width),
      scale,
      selectedLayout,
      isSVGPathBuilderOpen,
      previewOnly,
      isNodeRefreshRequire,
      setIsNodeRefreshRequire
    },
    PathBuilderProps: {
      scale,
      product,
      selectedLayout,
      onPathChange
    }
  };
};

export const getAllFonts = (template) => {
  const { layouts = [] } = template;
  const allFonts = [];
  layouts.forEach((l) => {
    const {
      fontFamily,
      fontStyle,
      fontWeight,
      fontProvider,
      fontUrl
    } = l.properties;
    // @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,300&display=swap');
    // @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
    if (l.type === 'text' || l.type === 'textPath') {
      const italic = fontStyle === 'italic';
      let url;
      if (fontProvider === 'google') {
        url = `https://fonts.googleapis.com/css2?family=${fontFamily}:${
          italic ? 'ital,' : ''
        }wght@${italic ? '1,' : ''}${fontWeight}&display=swap`;
      } else {
        url = fontUrl;
      }
      if (
        !allFonts.find(
          (font) => font.fontFamily === fontFamily && font.fontUrl === url
        )
      ) {
        allFonts.push({
          fontUrl: url,
          fontFamily,
          fontProvider
        });
      }
    }
  });
  return allFonts;
};

const replaceDynamicThemeValues = (template, selectedTheme, selectedLogo) => {
  const { layouts = [], templateGradients = [] } = template;
  template.layouts = layouts.map((layout) => {
    const p = layout.properties;
    if (p.themeColor) {
      p.fill.fill = selectedTheme.palette[p.themeColor];
    }
    if (p.themeFontFamily) {
      const { fontFamily, fontUrl, fontProvider } = selectedTheme.fontFamilies[
        p.themeFontFamily
      ];
      p.fontFamily = fontFamily;
      p.fontUrl = fontUrl;
      p.fontProvider = fontProvider;
    }
    if (p.themeImage) {
      p.src = selectedTheme.images[p.themeImage.split('-').pop()];
    }
    if (p.fill && p.fill.gradientId) {
      if (!p.fill.gradientId.includes(selectedTheme.id)) {
        p.fill.gradientId = `${p.fill.gradientId}-${selectedTheme.id}`;
      }
      p.fill.fill = `url(#${p.fill.gradientId})`;
    }
    if (layout.type === 'logo') {
      replaceDynamicThemeValues(p.template, selectedTheme);
    }
    return layout;
  });
  template.templateGradients = templateGradients.map((gradient) => {
    if (!gradient.id.includes(selectedTheme.id)) {
      gradient.id = `${gradient.id}-${selectedTheme.id}`;
    }
    gradient.gradientData.palette = gradient.gradientData.palette.map(
      (stop) => {
        if (stop.themeColor) {
          stop.color = selectedTheme.palette[stop.themeColor];
        }
        return stop;
      }
    );
    return gradient;
  });
};

const replaceDynamicTextValues = (template, dynamicTextValues) => {
  const { layouts = [] } = template;
  template.layouts = layouts.map((layout) => {
    const p = layout.properties;
    if (p.dynamicOptionValue) {
      p.text = dynamicTextValues[p.dynamicOptionValue];
    } else if (layout.type === 'logo') {
      replaceDynamicTextValues(p.template, dynamicTextValues);
    }
    return layout;
  });
};
