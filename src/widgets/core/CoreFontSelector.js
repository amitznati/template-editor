import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import BackIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  Popover,
  TextField,
  FormControl,
  MenuItem,
  MenuList,
  Fab
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  formControl: {
    flexDirection: 'row'
  },
  textInput: {
    flexGrow: 1
  }
});

class CoreFontPicker extends React.Component {
  constructor(props) {
    super(props);
    const { uploadedFonts } = props;
    const allFontsNames =
      (uploadedFonts && uploadedFonts.map((f) => f.name)) || [];
    const activeFonts = allFontsNames.slice(0, 30);
    this.state = {
      activeFonts,
      hasMore: !(activeFonts.length === allFontsNames.length),
      open: false,
      allFontsNames,
      searchResult: allFontsNames,
      textSearch: props.fontFamily
    };
    this.inputFamilyRef = React.createRef();
    !uploadedFonts && this.loadFonts();
  }

  loadFonts = () => {
    const googleFontAPIKey = this.props.googleFontAPIKey;
    // eslint-disable-next-line no-undef
    this.xhr1 = new XMLHttpRequest();
    /*eslint-disable */
		this.xhr1.open('GET', `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${googleFontAPIKey}`, true);
		/* eslint-enable */
    this.xhr1.send();
    this.xhr1.addEventListener('readystatechange', this.fontsLoaded, false);
  };

  fontsLoaded = () => {
    if (
      this.xhr1.readyState === 4 &&
      this.xhr1.status === 200 &&
      this.xhr1.responseText
    ) {
      const allFonts = JSON.parse(this.xhr1.responseText);
      if (allFonts) {
        const allFontsNames = allFonts.items.map((f) => f.family);
        const activeFonts = allFontsNames.slice(0, 30);
        const hasMore = !(activeFonts.length === allFontsNames.length);
        this.setState({
          allFontsNames,
          activeFonts,
          hasMore,
          searchResult: allFontsNames
        });
      }
    }
  };

  handleChange = (font) => {
    const { handleChange } = this.props;
    const { allFontsNames } = this.state;
    handleChange && handleChange(font);
    this.setState({
      anchorEl: null,
      textSearch: font,
      searchResult: allFontsNames,
      activeFonts: allFontsNames.slice(0, 29)
    });
  };

  loadMore = () => {
    const { activeFonts, searchResult } = this.state;
    const newActiveFonts = searchResult.slice(0, activeFonts.length + 30);
    const hasMore = !(newActiveFonts.length === searchResult.length);
    this.setState({ activeFonts: newActiveFonts, hasMore });
  };

  renderItems = () => {
    const { fontWeight, fontStyle } = this.props;
    const { activeFonts } = this.state;
    return activeFonts.map((font) => {
      return (
        <MenuItem
          onClick={() => this.handleChange(font)}
          key={font}
          style={{ fontFamily: font, fontWeight, fontStyle }}
        >
          {font}
        </MenuItem>
      );
    });
  };

  handleFamilyChange = (e) => {
    const { allFontsNames } = this.state;
    const textSearch = e.target.value;
    const searchResult = allFontsNames.filter((f) => f.includes(textSearch));
    const activeFonts = searchResult.slice(0, 30);
    const hasMore = !(activeFonts.length === searchResult.length);
    this.setState({ activeFonts, textSearch, searchResult, hasMore });
  };

  setOpen = (open) => {
    this.setState({ open });
  };

  render() {
    const { fontFamily, fontWeight, fontStyle, classes } = this.props;
    const { hasMore, textSearch, open } = this.state;
    return (
      <div>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            inputProps={{
              style: { fontFamily, fontStyle, fontWeight }
            }}
            ref={this.inputFamilyRef}
            className={classes.textInput}
            label='Font Family'
            value={textSearch}
            onChange={this.handleFamilyChange}
          />
          <Fab size='small' onClick={() => this.setOpen(true)}>
            <BackIcon />
          </Fab>
        </FormControl>
        <Popover
          open={open}
          anchorEl={this.inputFamilyRef.current}
          onClose={() => this.setOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuList
            style={{ height: '300px', overflow: 'auto', background: 'white' }}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={hasMore}
              useWindow={false}
              loader={
                <div className='loader' key={0}>
                  Loading ...
                </div>
              }
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

export default withStyles(styles)(CoreFontPicker);
