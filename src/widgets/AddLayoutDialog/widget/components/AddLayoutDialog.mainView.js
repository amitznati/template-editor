import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import {Dialog, Paper,Grid, DialogTitle, DialogActions,DialogContent, Button, Toolbar, AppBar, Tabs, Tab, Typography, IconButton} from '@material-ui/core';
import {logos} from 'mocks';
import { CoreText } from 'core';
function TabContainer(props) {
	return (
		<Typography component="div" >
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};
const types = [
	'logo','image','text','shape'
];
class AddLayoutDialogMainView extends React.Component {
	state = {
		value: 0,
		text: ''
	};

	onTextChanged = (text) => {
		this.setState({text});
	}

	handleClose = () => {
		this.props.onClose();
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	onImageSelect(url) {
		this.props.onClose(types[this.state.value],{url});
	}

	onTextSelect = () => {
		this.props.onClose('text', this.state.text);
	}

	render() {
		const {open, /* classes, onClose, selectedValue,*/ ...other } = this.props;
		const {value, text} = this.state;
		return (
			<Dialog
				onClose={this.handleClose}
				fullScreen
				open={open}
				aria-labelledby="simple-dialog-title" {...other}>
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
					{value === 0 && <TabContainer>
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
						</Grid>

					</TabContainer>}
					{value === 1 && <TabContainer>
						{/* <ThemeImagesList isForSelect onSelect={this.onImageSelect.bind(this)}/> */}
					</TabContainer>}
					{value === 2 && <TabContainer>
						<CoreText label="text" handleChange={this.onTextChanged} value={text}/>
						{/* <ButtonBase >ADD</ButtonBase> */}
						<Button variant="outlined" color="primary" onClick={this.onTextSelect}>
						ADD
						</Button>
					</TabContainer>
					}
					{value === 3 && <TabContainer>Shape</TabContainer>}
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

AddLayoutDialogMainView.propTypes = {
	//classes: PropTypes.object.isRequired,
	onClose: PropTypes.func,
	selectedValue: PropTypes.string,
	open: PropTypes.bool.isRequired
};

export default AddLayoutDialogMainView;
