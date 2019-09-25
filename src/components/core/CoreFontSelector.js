import React, { Component } from 'react';
import FontPicker from 'font-picker-react';
import config from '../../config';

export default class CoreFontSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeFontFamily: 'Open Sans',
		};
	}

	onChange = (nextFont) => {
		this.setState({activeFontFamily: nextFont.family});
		console.log(nextFont);
		this.props.onChange && this.props.onChange(nextFont.family);
	}
 
	render() {
		const {fontStyle = 'regular', fontWeight = '700'} = this.props;
		return (
			<div>
				<FontPicker
					apiKey={config.googleFontAPIKey}
					activeFontFamily={this.state.activeFontFamily}
					limit={20}
					onChange={this.onChange}
					variants={[fontStyle, fontWeight]}
				/>
				<p className="apply-font">The font will be applied to this text.</p>
			</div>
		);
	}
}