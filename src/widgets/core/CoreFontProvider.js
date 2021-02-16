import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const CoreFontProvider = ({ children, fontFamilies }) => {
  const theme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': fontFamilies
        }
      }
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CoreFontProvider;
