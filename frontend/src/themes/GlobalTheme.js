import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * Custom configuration for Global Theme
 */

const globalTheme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      'Raleway'
    ]
  },
  palette: {
    primary: {
      main: '#570E24' // maroon
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 11,
          paddingLeft: 50,
          paddingRight: 50,
          fontWeight: 'bold'
        }
      }
    }
  }
});

export default globalTheme;