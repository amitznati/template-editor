import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Dialog} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
		padding: theme.spacing(2)
	},
}));

export default function ImportModal({open, onClose, onImport, onConvert, convertedFilter}) {
	const classes = useStyles();
	const [xml, setXml] = React.useState('');
	const disabled = !convertedFilter || convertedFilter.Error;
	return (
		<Dialog fullWidth className={classes.root} onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
			<Button onClick={onClose} color="primary">Close</Button>
			<TextField
				label="filter"
				multiline
				fullWidth
				rows="10"
				value={xml}
				variant="outlined"
				onChange={(e) => setXml(e.target.value)}
			/>
			<Button onClick={() => onConvert(xml)} color="primary">Convert</Button>
			<TextField
				label="json"
				multiline
				fullWidth
				rows="10"
				value={JSON.stringify(convertedFilter)}
				variant="outlined"
			/>
			<Button onClick={onImport} disabled={disabled} color="primary">Import</Button>
		</Dialog>
	);
}
