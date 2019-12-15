import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, CircularProgress} from '@material-ui/core';
import WebFont from 'webfontloader';

import { CoreNumber, CoreSelect, CoreText, CoreFontSelector } from '../../../core';

const useStyles = makeStyles(theme => ({
	progress: {
		margin: theme.spacing(2),
	},
}));
const weightOptions =
	['normal','100','200','300','400','500','600','700','800','900','bold','bolder','lighter'].map((i) => {
		return {id: i, name: i};
	});

const styleOptions =
	['italic', 'normal'].map((i) => {
		return {id: i, name: i};
	});

const FontProperties = (props) => {

	const {text, fontSize, fontWeight, fontStyle, fontFamily, onPropertyChange} = props;
	const [loadingState, setLoadingState] = React.useState({});
	const classes = useStyles();
	const onFontPropertyChange = (name, value) => {

		const selectedFontFamily = name === 'fontFamily' ? value : fontFamily;
		const selectedFontWeight = name === 'fontWeight' ? value : fontWeight;
		const selectedFontStyle = name === 'fontStyle' ? value : fontStyle;
		WebFont.load({
			google: {
				families: [`${selectedFontFamily}:${selectedFontWeight}${selectedFontStyle}`]
			},
			fontactive: () => {
				setLoadingState({status: 'active', selectedFontFamily, selectedFontStyle, selectedFontWeight});
				onPropertyChange && onPropertyChange(name, value);
			},
			fontinactive: () => {
				setLoadingState({status: 'inactive', selectedFontFamily, selectedFontStyle, selectedFontWeight});
			},
			fontloading: () => {
				setLoadingState({status: 'loading', selectedFontFamily, selectedFontStyle, selectedFontWeight});
			}
		});
	};



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
					{...{fontWeight, fontStyle, fontFamily}}
					handleChange={v => onFontPropertyChange('fontFamily', v)}
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
					onChange={v => onFontPropertyChange('fontWeight', v)}
				/>
			</Grid>
			<Grid item xs={4}>
				<CoreSelect
					label="Style"
					value={fontStyle}
					options={styleOptions}
					onChange={v => onFontPropertyChange('fontStyle', v)}
				/>
			</Grid>
			<Grid container>
				<Grid item>
					{loadingState.status === 'loading' && <CircularProgress className={classes.progress} />}
					{loadingState.status === 'inactive' &&
						<div style={{color: 'red'}}>
							{`Failed To Load: ${loadingState.selectedFontFamily} ${loadingState.selectedFontWeight} ${loadingState.selectedFontStyle}`}
						</div>
					}
					{loadingState.status === 'active' &&
						<div style={{color: 'green'}}>
							{`Load: ${loadingState.selectedFontFamily} ${loadingState.selectedFontWeight} ${loadingState.selectedFontStyle}`}
						</div>
					}
				</Grid>
			</Grid>
		</Grid>
	);

};

export default FontProperties;
