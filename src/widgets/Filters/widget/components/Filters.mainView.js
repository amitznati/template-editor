import React from 'react';
import {Grid, Typography, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditFilter from './Filters.EditFilter';
import {CoreConfirmationDialog, CoreMenuSelect, CoreSortableList} from '../../../core';
import ImportModal from './Filters.importModal';

const useStyles = makeStyles(theme => ({
	marginB: {
		marginBottom: theme.spacing(2)
	},
}));

export default function FiltersMainView(props) {
	const {
		layoutFilters,
		presetsNames,
		onAddParentFilter,
		templateFiltersNamesList,
		onAddFilterFromPresets,
		removeFilterFromTemplate,
		...restProps
	} = props;
	const classes = useStyles();
	const [importOpen, setImportOpen] = React.useState(false);
	const [selectedTemplateFilter, setSelectedTemplateFilter] = React.useState(null);
	const [selectedItemForDelete, setSelectedItemForDelete] = React.useState(undefined);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
	const filtersList = layoutFilters.map(f => {
		return (
			<Grid key={f.id} item xs={12} className={classes.marginB}>
				<EditFilter parentFilter={f} {...restProps} />
			</Grid>
		);
	});

	const handleDelete = (isToDelete) => {
		setConfirmDeleteOpen(false);
		if (isToDelete) {
			removeFilterFromTemplate(selectedItemForDelete);
		}
	};

	const handleDeleteClick = (item) => {
		setSelectedItemForDelete(item);
		setConfirmDeleteOpen(true);
	};
	return (
		<Grid container>
			<CoreConfirmationDialog
				title="Are you sure?"
				contentText="If you delete this filter it will be deleted in all layouts that are using it."
				agreeText="Yes"
				disagreeText="Cancel"
				open={confirmDeleteOpen}
				handleClose={handleDelete}
			/>
			{(!filtersList || filtersList.length === 0) ?
				<Grid container>
					<Grid item xs={12} className={classes.marginB}>
						<Button onClick={() => setImportOpen(!importOpen)}>Import</Button>
						<ImportModal
							open={importOpen}
							onClose={() => setImportOpen(!importOpen)}
							primitivesNameList={restProps.primitivesNameList}
							onImport={() => {
								restProps.onImportFilter();
								setImportOpen(false);
							}}
							onConvert={restProps.onConvert}
							convertedFilter={restProps.convertedFilter}
						/>
					</Grid>
					<Grid item xs={12} className={classes.marginB}>
						<Typography variant="subtitle1" gutterBottom>Presets Filters</Typography>
						<CoreMenuSelect
							options={presetsNames}
							onAdd={onAddFilterFromPresets}
							placeHolder="Add Filter From Presets..."
						/>
					</Grid>
					<Grid item xs={12} className={classes.marginB}>
						<Typography variant="subtitle1" gutterBottom>Template Filters</Typography>
						<CoreMenuSelect
							options={templateFiltersNamesList}
							onAdd={onAddParentFilter}
							placeHolder="Add Filter From Template..."
							onSelect={setSelectedTemplateFilter}
							onDelete={selectedTemplateFilter && selectedTemplateFilter.id !== 'new' && handleDeleteClick}
						/>
					</Grid>
				</Grid>
				:
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="subtitle1" gutterBottom>Layout Filters List</Typography>
						<CoreSortableList
							items={filtersList}
							useDragHandle={true}
							sortable={false}
						/>
					</Grid>
				</Grid>
			}
		</Grid>
	);

}
