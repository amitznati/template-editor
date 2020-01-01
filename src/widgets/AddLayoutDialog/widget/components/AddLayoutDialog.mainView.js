import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {Dialog, Paper,Grid, DialogTitle, DialogActions,DialogContent, Button, Toolbar, AppBar, Tabs, Tab, Typography, IconButton} from '@material-ui/core';
import {logos} from 'mocks';
import TextTab from './AddLayoutDialog.textTab';

const types = [
	'logo','image','text','shape'
];
class AddLayoutDialogMainView extends React.Component {
	state = {
		value: 0,
		text: ''
	};

	handleClose = () => {
		this.props.onClose();
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	onImageSelect(url) {
		this.props.onClose(types[this.state.value],{url});
	}

	render() {
		const {open, onClose } = this.props;
		const {value} = this.state;
		return (
			<Dialog
				onClose={this.handleClose}
				fullScreen
				open={open}
				aria-labelledby="simple-dialog-title">
				<DialogTitle id="simple-dialog-title">
					<AppBar position="static">
						<Toolbar>
							<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="h6" color="inherit" >
								Add Layout
							</Typography>
						</Toolbar>
						<Tabs value={value} onChange={this.handleChange.bind(this)}>
							<Tab label="Logo" />
							<Tab label="Image"/>
							<Tab label="Text" />
							<Tab label="Shape" />
						</Tabs>
					</AppBar>
				</DialogTitle>
				<DialogContent>
					{value === 0 &&
						<Grid container>
							{logos.map((l,i) => {
								return (
									<Grid item md={3} key={i}>
										<Paper style={{textAlign: 'center', margin: '8px'}}>
											<img src={l} style={{height: '200px'}} alt={'logo ' + i}/>
										</Paper>
									</Grid>
								);
							})}
						</Grid>}
					{value === 1 && <div></div>}
					{value === 2 && <TextTab onSelect={onClose} />}
					{value === 3 && <div>Shape</div>}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="primary">
					Close
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default AddLayoutDialogMainView;
