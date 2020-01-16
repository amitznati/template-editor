import React from 'react';
import {Button, DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog} from '@material-ui/core';

export default function CoreConfirmationDialog({open, handleClose, title, contentText, agreeText, disagreeText}) {
	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{contentText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{disagreeText && <Button onClick={() => handleClose(false)} color="primary">
					{disagreeText}
				</Button>}
				{agreeText && <Button onClick={() => handleClose(true)} color="primary" autoFocus>
					{agreeText}
				</Button>}
			</DialogActions>
		</Dialog>
	);
}
