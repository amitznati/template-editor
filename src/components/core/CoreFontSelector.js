
import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import {Popover, Button, MenuItem, MenuList} from '@material-ui/core';
import config from '../../config';

class CoreFontPicker extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			activeFonts: [],
			hasMore: false,
			anchorEl: null,
			allFontsNames: []
		}
		this.loadFonts();
	}

	loadFonts = () => {
		this.xhr1 = new XMLHttpRequest();
        /*eslint-disable */
        this.xhr1.open('GET', `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${config.googleFontAPIKey}`, true);
        /*eslint-enable */
        this.xhr1.send();
		this.xhr1.addEventListener('readystatechange', this.fontsLoaded, false);
	};

	fontsLoaded = () => {
		if (this.xhr1.readyState === 4 && this.xhr1.status === 200 && this.xhr1.responseText) {
			const allFonts = JSON.parse(this.xhr1.responseText);
			console.log(allFonts);
			if (allFonts) {
				const allFontsNames = allFonts.items.map(f => f.family);
				const activeFonts = allFontsNames.slice(0, 30);
				const hasMore = !(activeFonts.length === allFontsNames.length);
				this.setState({allFontsNames, activeFonts, hasMore});
			}
        }
	}
	// const allFontsSlice = allFonts.slice(0, 30);
	// const [anchorEl, setAnchorEl] = React.useState(null);
	// const [activeNames, setActiveNames] = React.useState(allFontsSlice);
	// const [hasMore, setHasMore] = React.useState(!(allFontsSlice.length === allFonts.length));
	handleChange = (font) => {
		const {handleChange} = this.props;
		handleChange && handleChange(font);
		this.setState({anchorEl: null})
	};

	loadMore = () => {
		const {activeFonts, allFontsNames} = this.state;
		const newActiveFonts = allFontsNames.slice(0, activeFonts.length + 30);
		this.setState({activeFonts: newActiveFonts, hasMore: !(newActiveFonts.length === allFontsNames.length)});
	};

	renderItems = () => {
		const {fontWeight, fontStyle} = this.props;
		const {activeFonts} = this.state;
		const items = activeFonts.map(font => {
			return (
				<MenuItem onClick={() => this.handleChange(font)} key={font} style={{fontFamily: font, fontWeight, fontStyle}}>{font}</MenuItem>
			)
		});
		return items;
	};

	render() {
		const {value, fontFamily, fontWeight, fontStyle} = this.props;
		const {anchorEl, hasMore} = this.state;
		const open = Boolean(anchorEl);
		const id = open ? 'stroke-color-popover' : undefined;
		
		return (
			<div>
				<Button aria-describedby={id} size="small" onClick={(e) => this.setState({anchorEl: e.currentTarget})} style={{fontFamily, fontWeight, fontStyle}}>
					{value}
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={() => this.setState({anchorEl: null})}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
				>
					<MenuList style={{height: '500px', overflow: 'auto'}}>
						<InfiniteScroll
							pageStart={0}
							loadMore={this.loadMore}
							hasMore={hasMore}
							useWindow={false}
							loader={<div className="loader" key={0}>Loading ...</div>}
						>
							
							{this.renderItems()}
						</InfiniteScroll>
					</MenuList>
				</Popover>
			</div>
			
		);
			}
	
}

CoreFontPicker.propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.any
};

export default CoreFontPicker;