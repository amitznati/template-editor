import React from 'react';
import {Grid} from '@material-ui/core';
import { CoreNumber, CoreSelect, CoreFontSelector } from '../core';
const FontProperties = (props) => {
	const weightOptions =
	['normal','100','200','300','400','500','600','700','800','900','bold','bolder','lighter'].map((i) => {
		return {id: i, name: i};
	});

	const {layout: {properties: {fontSize, fontWeight}}} = props;
	
	return (
		<Grid container>
			<Grid item xs={12} >
				<CoreFontSelector />
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
					onChange={v => props.onPropertyChange && props.onPropertyChange('fontWeight', v)}
				/>
			</Grid>
		</Grid>
	);
};

export default FontProperties;