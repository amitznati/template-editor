import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress, Chip } from '@material-ui/core';

import { CoreNumber, CoreSelect, CoreText } from '../../../core';
import CoreThemeVariantSelect from '../../../core/CoreThemeVariantSelect';
import CoreFontSelect, { uploadFont } from '../../../core/CoreFontSelect';

const useStyles = makeStyles((theme) => ({
  progress: {
    margin: theme.spacing(2)
  }
}));
const weightOptions = [
  'normal',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  'bold',
  'bolder',
  'lighter'
].map((i) => {
  return { id: i, name: i };
});

const styleOptions = ['italic', 'normal'].map((i) => {
  return { id: i, name: i };
});

const FontProperties = (props) => {
  const {
    text,
    dynamicOptionValue,
    dynamicTextOptions,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
    onPropertyChange,
    fontProvider,
    uploadedFonts,
    onPropertiesChange,
    themeFontFamily
  } = props;
  const dynamicOptions = dynamicTextOptions.map((o) => ({ id: o, name: o }));
  const [loadingState, setLoadingState] = React.useState({});
  const isGoogleFontProvider = fontProvider === 'google';
  const classes = useStyles();
  const onSelectThemeFontFamily = (fontVariant) => {
    onPropertyChange('themeFontFamily', fontVariant);
  };
  const onFontProviderChange = (v) => {
    if (uploadedFonts.length) {
      onPropertiesChange([
        { name: 'fontProvider', value: v === 0 ? 'google' : 'uploaded' },
        {
          name: 'fontFamily',
          value: v === 0 ? 'Raleway' : uploadedFonts[0].name
        },
        {
          name: 'fontUrl',
          value: v === 0 ? '' : uploadedFonts[0].url
        }
      ]);
    }
  };
  const onFontFamilyChange = (font) => {
    onPropertiesChange([
      { name: 'fontFamily', value: font.fontFamily },
      { name: 'fontProvider', value: font.fontProvider },
      { name: 'fontUrl', value: font.fontUrl }
    ]);
  };

  const onFontPropertyChange = (name, value) => {
    const successLoadCallback = () => onPropertyChange(name, value);
    const selectedFontWeight = name === 'fontWeight' ? value : fontWeight;
    const selectedFontStyle = name === 'fontStyle' ? value : fontStyle;
    if (!isGoogleFontProvider) {
      successLoadCallback();
    } else {
      uploadFont({
        selectedFontFamily: fontFamily,
        selectedFontWeight,
        selectedFontStyle,
        successLoadCallback,
        uploadedFonts,
        setLoadingState,
        isGoogleFontProvider
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CoreText
          label='Text'
          value={text}
          handleChange={(v) => onPropertyChange('text', v)}
        />
        {dynamicOptionValue && (
          <Chip variant='outlined' color='primary' label={dynamicOptionValue} />
        )}
      </Grid>
      <Grid item xs={12}>
        <CoreSelect
          label='Dynamic Text'
          value={dynamicOptionValue}
          options={[{ id: 'none', name: 'None' }].concat(dynamicOptions)}
          onChange={(v) =>
            onPropertyChange('dynamicOptionValue', v === 'none' ? '' : v)
          }
        />
      </Grid>
      <Grid item xs={12}>
        <CoreFontSelect
          {...{
            fontProvider,
            fontWeight,
            fontStyle,
            fontFamily,
            uploadedFonts,
            onFontProviderChange,
            onFontFamilyChange,
            setLoadingState
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <CoreThemeVariantSelect
          value={themeFontFamily}
          onSelect={onSelectThemeFontFamily}
          className={classes.progress}
        />
      </Grid>
      <Grid item xs={3}>
        <CoreNumber
          label='Size'
          value={fontSize}
          onChange={(v) => onPropertyChange('fontSize', v)}
        />
      </Grid>
      <Grid item xs={3}>
        <CoreSelect
          label='Weight'
          value={fontWeight}
          options={weightOptions}
          onChange={(v) => onFontPropertyChange('fontWeight', v)}
        />
      </Grid>
      <Grid item xs={4}>
        <CoreSelect
          label='Style'
          value={fontStyle}
          options={styleOptions}
          onChange={(v) => onFontPropertyChange('fontStyle', v)}
        />
      </Grid>
      <Grid container>
        <Grid item>
          {loadingState.status === 'loading' && (
            <CircularProgress className={classes.progress} />
          )}
          {loadingState.status === 'inactive' && (
            <div style={{ color: 'red' }}>
              {`Failed To Load: ${loadingState.selectedFontFamily} ${loadingState.selectedFontWeight} ${loadingState.selectedFontStyle}`}
            </div>
          )}
          {loadingState.status === 'active' && (
            <div style={{ color: 'green' }}>
              {`Load: ${loadingState.selectedFontFamily} ${loadingState.selectedFontWeight} ${loadingState.selectedFontStyle}`}
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FontProperties;
