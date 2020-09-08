import React from 'react';
import {CoreConfirmationDialog, CoreMenuSelect} from '../../../core';

export default function SelectGradient({selectGradientOptions, onAddGradient, removeGradientFromTemplate}) {
	const [selectedItem, setSelectedItem] = React.useState(undefined);
	const [selectedItemForDelete, setSelectedItemForDelete] = React.useState(undefined);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
	const handleDelete = (isToDelete) => {
		setConfirmDeleteOpen(false);
		if (isToDelete) {
			removeGradientFromTemplate(selectedItemForDelete);
		}
	};

	const handleDeleteClick = (item) => {
		setSelectedItemForDelete(item);
		setConfirmDeleteOpen(true);
	};
	return (
		<div>
			<CoreMenuSelect
				options={selectGradientOptions}
				onAdd={onAddGradient}
				onSelect={setSelectedItem}
				onDelete={selectedItem && selectedItem.id !== 'new' && handleDeleteClick}
			/>
			<CoreConfirmationDialog
				title="Are you sure?"
				contentText="If you delete this gradient it will be deleted in all layouts that are using it."
				agreeText="Yes"
				disagreeText="Cancel"
				open={confirmDeleteOpen}
				handleClose={handleDelete}
			/>
		</div>

	);
}
