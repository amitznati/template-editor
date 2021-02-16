import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable */

const createFontQuery = (fontFamilyName, stylesArray) => {
	const stylesString = stylesArray.join(',');
	const fontQuery = `${fontFamilyName}${stylesArray.length > 0 ? `:${stylesString}` : ''}`;
	// if (stylesString.length === 0) return false;
	return fontQuery;
};

const checkLoadedFonts = (family, fonts) => {
	const familyName = family.split(':')[0];
	const styles = family.split(':')[1] ? family.split(':')[1].split(',') : [];
	const stylesToLoad = [];
	styles.forEach((style, index) => {
		const weight = style.charAt(0);
		const classification = style.charAt(3) || 'n';
		const styleToCheck = classification + weight;
		if (fonts && (!(familyName + ' ' + styleToCheck in fonts) || (familyName + ' ' + styleToCheck in fonts && fonts[(familyName + ' ' + styleToCheck)].subset))) {
		  stylesToLoad.push(styles[index]);
		}
	});
	const fontQuery = (createFontQuery(familyName, stylesToLoad));
	return fontQuery;
};

const loadFontStylesheet = (fontFamilies) => {
  fontFamilies.forEach((font) => {
    const url = font.fontUrl;
    const selectedFontFamily = font.fontFamily;
    const markup = [
      '@font-face {\n',
      "\tfont-family: '",
      selectedFontFamily,
      "';\n",
      "\tsrc: url('",
      url,
      "');\n",
      '}\n'
    ].join('');
    if (!document.getElementById(`uploaded-font-${selectedFontFamily}`)) {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('id', `uploaded-font-${selectedFontFamily}`);
      style.innerHTML = markup;
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  })
};



export default class FontLoader extends React.Component {
	componentDidMount() {
		const { fonts, fontProvider, fontFamilies, customFontFamilies } = this.props;
		const stylesToLoad = [];
    if (customFontFamilies.length && fontProvider.includes('custom')) {
      this.loadUploadedFonts(customFontFamilies);
    }
    if (fontFamilies.length && fontProvider.includes('google')) {
			fontFamilies.forEach((family) => {
				const inactiveFonts = checkLoadedFonts(family, fonts);
				if (inactiveFonts && !stylesToLoad.includes(inactiveFonts)) stylesToLoad.push(inactiveFonts);
			});
			if (stylesToLoad && stylesToLoad.length > 0) {
				this.loadFonts('google', stylesToLoad);
			}
		}
	}

	shouldComponentUpdate() {
		return false;
	}

  loadUploadedFonts(fontFamilies) {
	  loadFontStylesheet(fontFamilies);
	  const stylesToLoad = fontFamilies.map((f) => f.fontFamily);
	  const customUrls = fontFamilies.map((f) => f.fontUrl);
	  this.loadFonts('custom', stylesToLoad, customUrls);
  }

	loadFonts(fontProvider, stylesToLoad, customUrls) {
		const {
			onActive,
			onInactive,
			onLoading,
			fontIsLoading,
			fontIsLoaded,
			fontLoadFailed,
			typekitId,
			typekitAPI,
			fontdeckId,
			monotypeProjectId,
			monotypeVersion,
			monotypeLoadAllFonts,
			timeout,
			text,
			debug,
			classes } = this.props;
		const WebFont = require('webfontloader');

		WebFont.load({
			[fontProvider]: {
				families: stylesToLoad,
				id: typekitId || fontdeckId,
				projectId: monotypeProjectId,
				version: monotypeVersion,
				loadAllFonts: monotypeLoadAllFonts,
				api: typekitAPI || '',
				urls: customUrls || {},
				text
			},
			loading: () => {
				if (debug) console.info('…Loading WebFonts');
				onLoading();
			},
			active: () => {
				if (debug) console.info('WebFonts are Active!');
				onActive();
			},
			inactive: () => {
				if (debug) console.warn('WebFonts Failed to Load 😱');
				onInactive();
			},
			fontloading: (familyName, fvd) => {
				if (debug) console.info(familyName + ' ' + fvd + ' is Loading');
				fontIsLoading();
			},
			fontactive: (familyName, fvd) => {
				if (debug) console.info(familyName + ' ' + fvd + ' is Active!');
				fontIsLoaded(familyName, fvd, text);
			},
			fontinactive: (familyName, fvd) => {
				if (debug) console.warn(familyName + ' ' + fvd + ' Failed to Load');
				fontLoadFailed(familyName, fvd);
			},
			classes,
			timeout: timeout
		});
	}

	render() {
		return null;
	}
}

FontLoader.propTypes = {
	fontProvider: PropTypes.arrayOf(
	  PropTypes.oneOf([
		'google',
		'typekit',
		'fontdeck',
		'monotype',
		'custom',
	])).isRequired,
	fontFamilies: PropTypes.array.isRequired,
  customFontFamilies: PropTypes.arrayOf(
    PropTypes.shape({
    fontFamily: PropTypes.string,
    fontUrl: PropTypes.string
  })),

	text: PropTypes.string,
	typekitId: PropTypes.string,
	typekitAPI: PropTypes.string,
	fontdeckId: PropTypes.string,
	monotypeProjectId: PropTypes.string,
	monotypeVersion: PropTypes.string,
	monotypeLoadAllFonts: PropTypes.bool,
	customUrls: PropTypes.array,

	onActive: PropTypes.func,
	onInactive: PropTypes.func,
	onLoading: PropTypes.func,
	fontIsLoaded: PropTypes.func,
	fontIsLoading: PropTypes.func,
	fontLoadFailed: PropTypes.func,

	fonts: PropTypes.object,
	timeout: PropTypes.number,
	classes: PropTypes.bool,
	debug: PropTypes.bool,
};

FontLoader.defaultProps = {
	fonts: {},
	fontIsLoaded: () => {},
	fontIsLoading: () => {},
	fontLoadFailed: () => {},
	onActive: () => {},
	onInactive: () => {},
	onLoading: () => {},
	timeout: 3000,
	classes: false,
};
