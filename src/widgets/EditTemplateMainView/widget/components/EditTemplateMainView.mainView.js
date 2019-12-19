import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Button} from '@material-ui/core';
import {TemplatePreview, AddLayoutDialog, LayoutsList} from 'widgets';
import {CoreSlider} from 'core';
import FontLoader from '../../../../sdk/services/fontLoader';
import withRoot from '../../../../withRoot';

const styles = theme => ({
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
	}
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
			<Grid container className={classes.rootGrid}>
				<AddLayoutDialog
					open={isAddLayoutDialogOpen}
					onClose={handleAddClose}
				/>
				<Grid item xs={12} className={classes.section}>
					<Button variant="outlined" color="primary" onClick={saveTemplate}>
						Save
					</Button>
				</Grid>
				<Grid item md={3} className={classes.section}>
					<Button variant="outlined" color="primary" onClick={() => toggleAddLayoutDialog(true)}>
					+ Add Layout
					</Button>
					<LayoutsList />
				</Grid>
				<Grid item md={9} className={classes.section}>
					<CoreSlider
						label="Scale"
						value={scale}
						max={3}
						step={0.001}
						handleSliderChange={(v)=> updateScale(Number(Number(v).toFixed(2)))}
					/>
					<div className={classes.templatePaper}>
						{allFontsLoaded &&
							<TemplatePreview />
						}
						{allFonts && allFonts.length && <FontLoader
							fontProvider="google"
							fontFamilies={allFonts}
							onActive={setAllFontsLoaded}
						/>}
					</div>
				</Grid>
			</Grid>
		);
	}
}
EditTemplateMainViewMainView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(EditTemplateMainViewMainView));
