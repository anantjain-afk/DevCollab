// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#f4f4f4', // A light grey for contrast
    },
    background: {
      default: '#f4f7f9', // The light grey background from App.css
    },
  },
  // You can also override component styles here
  components: {
    // Example: Make all buttons uppercase by default
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Or 'uppercase' if you prefer
        },
      },
    },
  },
});

export default theme;