import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Button, Drawer, Hidden, Typography, Icon, IconButton, Toolbar, AppBar, CssBaseline} from '@material-ui/core';
import {TemplatePreview, AddLayoutDialog, LayoutsList} from 'widgets';
import {CoreSlider} from 'core';
import FontLoader from '../../../../sdk/services/fontLoader';
import withRoot from '../../../../withRoot';

const drawerWidth = 500;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
		background: '#ececec'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	section: {
		padding: '20px 0'
	},
	templatePaper: {
		position: 'relative',
		overflow: 'auto',
		padding: '20px 0',
		margin: 0
	},
	rootGrid: {
		// minHeight: '100%',
		padding: theme.spacing(1)
	},
	grow: {
		flexGrow: 1,
	},
});


class EditTemplateMainViewMainView extends React.Component {

	render() {
		const {
			classes,
			scale,
			allFontsLoaded,
			allFonts,
			updateScale,
			toggleAddLayoutDialog,
			handleAddClose,
			isAddLayoutDialogOpen,
			saveTemplate,
			setAllFontsLoaded
		} = this.props;

		return (
			<div className={classes.root}>
				<CssBaseline />
				<AddLayoutDialog
					open={isAddLayoutDialogOpen}
					onClose={handleAddClose}
				/>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							SVG Template Editor
						</Typography>
						<div className={classes.grow} />
						<IconButton
							color="inherit"
							onClick={saveTemplate}
						>
							<Icon>save</Icon>
						</IconButton>
						<IconButton
							color="inherit"
							onClick={toggleAddLayoutDialog}
						>
							<Icon>add</Icon>
						</IconButton>
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer} aria-label="mailbox folders">
					<Hidden xsDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper,
							}}
							variant="permanent"
							open
						>
							<Button variant="contained" color="primary" onClick={() => toggleAddLayoutDialog(true)}>
								+ Add Layout
							</Button>
							<LayoutsList />
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<CoreSlider
						label="Scale"
						value={scale}
						max={3}
						step={0.001}
						handleSliderChange={(v)=> updateScale(Number(Number(v).toFixed(2)))}
					/>
					<div className={classes.templatePaper}>
						{allFonts && allFonts.length > 0 &&
							<FontLoader
								fontProvider="google"
								fontFamilies={allFonts}
								onActive={setAllFontsLoaded}
							/>
						}
						{(allFontsLoaded || !allFonts || allFonts.length === 0) &&
							<TemplatePreview />
						}
					</div>
				</main>
			</div>
		);
	}
}

export default withRoot(withStyles(styles)(EditTemplateMainViewMainView));
