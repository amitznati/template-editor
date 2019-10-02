import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import { CoreNumber, CoreSelect, CoreFontSelector } from '../core';
import FontLoader from '../../fontLoader';

const FontProperties = (props) => {
	const weightOptions =
	['normal','100','200','300','400','500','600','700','800','900','bold','bolder','lighter'].map((i) => {
		return {id: i, name: i};
	});

	const styleOptions =
	['italic'].map((i) => {
		return {id: i, name: i};
	});

	const {layout: {properties: {fontSize, fontWeight, fontStyle, fontFamily}}} = props;
	const onPropertyChange = (name, value) => {
		const WebFont = require('webfontloader');
		const selectedFontFamily = name === 'fontFamily' ? value : fontFamily;
		const selectedFontWeight = name === 'fontWeight' ? value : fontWeight;
		const selectedFontStyle = name === 'fontStyle' ? value : fontStyle;
		WebFont.load({
			google: {
				families: [`${selectedFontFamily}:${selectedFontWeight}${selectedFontStyle}`]
			},
			active: () => {
				props.onPropertyChange && props.onPropertyChange(name, value);
			}
		});
	}

	const onFontActive = (familyName, fvd) => {
		console.info(familyName + ' ' + fvd + ' is Active!');
	};

	return (
		<Grid container>
			<Grid item xs={12} >
				<CoreFontSelector
					{...{fontFamily, fontStyle, fontWeight}}
					onChange={v => onPropertyChange('fontFamily', v)}
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
					onChange={v => onPropertyChange('fontWeight', v)}
				/>
			</Grid>
			<Grid item xs={3}>
				<CoreSelect
					label="Style"
					value={fontStyle}
					options={styleOptions}
					onChange={v => onPropertyChange('fontStyle', v)}
				/>
			</Grid>
			{/* <FontLoader
				fontProvider="google"
				fontFamilies={[`${selectedFontFamily}:${selectedFontWeight}${selectedFontStyle}`]}
				fontactive={onFontActive}
			/> */}
		</Grid>
	);
};

export default FontProperties;