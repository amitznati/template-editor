
import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import {Popper , TextField, FormControl, ClickAwayListener, MenuItem, MenuList} from '@material-ui/core';
import config from '../../config';

class CoreFontPicker extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			activeFonts: [],
			hasMore: false,
			open: false,
			allFontsNames: [],
			searchResult: [],
			textSearch: props.fontFamily
		}
		this.inputFamilyRef = React.createRef();
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
			if (allFonts) {
				const allFontsNames = allFonts.items.map(f => f.family);
				const activeFonts = allFontsNames.slice(0, 30);
				const hasMore = !(activeFonts.length === allFontsNames.length);
				this.setState({allFontsNames, activeFonts, hasMore, searchResult: allFontsNames});
			}
        }
	}

	handleChange = (font) => {
		const {handleChange} = this.props;
		const {allFontsNames} = this.state;
		handleChange && handleChange(font);
		this.setState({anchorEl: null, textSearch: font, searchResult: allFontsNames, activeFonts: allFontsNames.slice(0, 29)});
	};

	loadMore = () => {
		const {activeFonts, searchResult} = this.state;
		const newActiveFonts = searchResult.slice(0, activeFonts.length + 30);
		const hasMore = !(newActiveFonts.length === searchResult.length);
		this.setState({activeFonts: newActiveFonts, hasMore});
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

	handleFamilyChange = (e) => {
		const {allFontsNames} = this.state;
		const textSearch = e.target.value;
		const searchResult = allFontsNames.filter(f => f.includes(textSearch));
		const activeFonts = searchResult.slice(0 ,30);
		const hasMore = !(activeFonts.length === searchResult.length);
		this.setState({activeFonts, textSearch, searchResult, hasMore});
	};

	render() {
		const {fontFamily, fontWeight, fontStyle} = this.props;
		const {hasMore, textSearch, anchorEl} = this.state;
		const open = Boolean(anchorEl);
		const id = open ? 'stroke-color-popover' : undefined;
		
		return (
			<div>
				<ClickAwayListener onClickAway={() => this.setState({anchorEl: null})}>
					<div ref={this.inputFamilyRef}>
						<FormControl fullWidth>
							<TextField
								inputProps={{
									style: {fontFamily, fontStyle, fontWeight}
								}}
								label="Font Family"
								value={textSearch}
								onFocus={(e) => this.setState({anchorEl: e.currentTarget})}
								onChange={this.handleFamilyChange}
							/>
						</FormControl>
					</div>
				</ClickAwayListener>
				<Popper
					id={id}
					open={open}
					anchorEl={anchorEl}
					// anchorOrigin={{
					// 	vertical: 'bottom',
					// 	horizontal: 'left',
					// }}
					// transformOrigin={{
					// 	vertical: 'top',
					// 	horizontal: 'left',
					// }}
				>
					<MenuList style={{height: '300px', overflow: 'auto', background: 'white'}}>
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
				</Popper>
			</div>
			
		);
			}
	
}

CoreFontPicker.propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.any
};

export default CoreFontPicker;