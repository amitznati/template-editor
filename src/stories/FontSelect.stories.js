import React from 'react';
import CoreFontSelect from '../widgets/core/CoreFontSelect';

export default {
  title: 'FontSelect',
  component: CoreFontSelect
};

export const FontSelect = () => {
  const onFontProviderChange = () => {};
  const onFontFamilyChange = () => {};
  const setLoadingState = () => {};
  return (
    <CoreFontSelect
      {...{
        fontProvider: 'google',
        fontWeight: 400,
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        uploadedFonts: [],
        onFontProviderChange,
        onFontFamilyChange,
        setLoadingState,
        googleFontAPIKey: 'xxxxxxxxxxxxxxxxxxxxxxx'
      }}
    />
  );
};
