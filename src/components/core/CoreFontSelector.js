import React from 'react';
import FontPicker from 'font-picker-react';
import config from '../../config';

 class CoreFontSelector extends React.Component {


	fontLoaded = () => {
		if (this.xhr1.readyState === 4 && this.xhr1.status === 200) {
            // this.aemmessages = JSON.parse(this.xhr1.responseText);
			// localStorage.setItem('uiErrormessages', this.xhr1.responseText);
			if (this.props.onChange) {
				this.props.onChange(this.nextFontFamily);
			}
        }
	}

	loadFont = (nextFont) => {
		const {fontStyle = 'regular', fontWeight = '100'} = this.props;
		this.xhr1 = new XMLHttpRequest();
		this.nextFontFamily = nextFont.family;
        /*eslint-disable */
        this.xhr1.open('GET', `https://fonts.googleapis.com/css?family=${nextFont.family}:${fontWeight}${fontStyle}`, true);
        /*eslint-enable */
        this.xhr1.send();
		this.xhr1.addEventListener('readystatechange', this.fontLoaded, false);
	}


	render() {
		const {fontStyle = 'regular', fontWeight = '100', fontFamily = 'Raleway'} = this.props;
		return (
			<div>
				<FontPicker
					apiKey={config.googleFontAPIKey}
					activeFontFamily={fontFamily}
					limit={50}
					onChange={this.loadFont}
					variants={[fontStyle, fontWeight]}
					sort="popularity"
				/>
			</div>
		);
	}
}

export default CoreFontSelector