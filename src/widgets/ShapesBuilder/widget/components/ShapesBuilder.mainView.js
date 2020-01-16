import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button} from '@material-ui/core';
import {CoreMenuSelect, CoreExpandableSortablePaper, CoreGeneralField} from '../../../core';
import {TemplatePreview} from 'widgets';
import {shapesAttrs, shapesData} from './../../Data';



const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1)
	},
}));

export default function ShapesBuilderMainView() {
	const classes = useStyles();
	const shapesNamesList = Object.keys(shapesAttrs).map(s => {
		const shape = shapesAttrs[s];
		return {name: shape.name, id: shape.name};
	});
	const {layout: circleLayout, inputData: circleInputData} = shapesData.circle;
	return (
		<div className={classes.root} >
			<Grid container>
				<Grid item xs={3}>
					<CoreMenuSelect
						options={shapesNamesList}
					/>
					<CoreExpandableSortablePaper
						header="Circle"
					>
						<Grid container>
							{Object.keys(circleInputData).map((inputData, i) => {
								const value = circleLayout.properties[inputData];
								const type = circleInputData[inputData].type;
								return (
									<Grid className={classes.root} item xs={4} key={`field-${i}`}>
										<CoreGeneralField label={inputData} type={type} value={value}
										/>
									</Grid>
								);
							})}
						</Grid>
					</CoreExpandableSortablePaper>
				</Grid>
				<Grid item xs={9}>
					<TemplatePreview scale={0.5} editLayouts={[circleLayout]}/>
				</Grid>
			</Grid>
			<Grid container>
				<Button color="primary" variant="contained">Add to template</Button>
			</Grid>
		</div>
	);
}
