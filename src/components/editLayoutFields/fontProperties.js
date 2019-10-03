import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import WebFont from 'webfontloader';

import { CoreNumber, CoreSelect, CoreText, CoreFontSelector } from '../core';

// const useStyles = makeStyles(theme => ({
// 	progress: {
// 	  margin: theme.spacing(2),
// 	},
// }));
const weightOptions =
	['normal','100','200','300','400','500','600','700','800','900','bold','bolder','lighter'].map((i) => {
		return {id: i, name: i};
	});

const styleOptions =
	['italic', 'normal'].map((i) => {
		return {id: i, name: i};
	});

class FontProperties extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			fontsNames: []
		}
	}

	onPropertyChange = (name, value) => {
		const {fontWeight, fontStyle, fontFamily, onPropertyChange} = this.props;
		const selectedFontFamily = name === 'fontFamily' ? value : fontFamily;
		const selectedFontWeight = name === 'fontWeight' ? value : fontWeight;
		const selectedFontStyle = name === 'fontStyle' ? value : fontStyle;
		WebFont.load({
			google: {
				families: [`${selectedFontFamily}:${selectedFontWeight}${selectedFontStyle}`]
			},
			fontactive: (familyName, fvd) => {
				console.info(familyName + ' ' + fvd + ' is Active!');
				onPropertyChange && onPropertyChange(name, value);
			},
		});
	};

	render() {
		const props = this.props;
		const {fontSize, fontWeight, fontStyle, fontFamily, text} = props;
		return (
			<Grid container>
				<Grid item xs={12}>
					<CoreText
						label="Text"
						value={text}
						handleChange={v => props.onPropertyChange && props.onPropertyChange('text', v)}
					/>
				</Grid>
				<Grid item xs={12} >
					<CoreFontSelector
						value={fontFamily}
						handleChange={v => this.onPropertyChange('fontFamily', v)}
					/>
				</Grid>
				<Grid item xs={3}>
					<CoreNumber
						label="Size"
						value={fontSize}
						onChange={v => props.onPropertyChange && props.onPropertyChange('fontSize', v)}
					/>
				</Grid>
				<Grid item xs={3}>
					<CoreSelect
						label="Weight"
						value={fontWeight}
						options={weightOptions}
						onChange={v => this.onPropertyChange('fontWeight', v)}
					/>
				</Grid>
				<Grid item xs={4}>
					<CoreSelect
						label="Style"
						value={fontStyle}
						options={styleOptions}
						onChange={v => this.onPropertyChange('fontStyle', v)}
					/>
				</Grid>
			</Grid>
		);
	}
};

export default FontProperties;