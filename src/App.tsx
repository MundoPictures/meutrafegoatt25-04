import React, { createContext, useContext } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Router from './Router';
import useFacebook from './hooks/useFacebook';
import './App.css';

// Create Facebook context
export const FacebookContext = createContext<ReturnType<typeof useFacebook> | null>(null);

// Custom hook to use the Facebook context
export const useFacebookContext = () => {
  const context = useContext(FacebookContext);
  if (!context) {
    throw new Error('useFacebookContext must be used within a FacebookProvider');
  }
  return context;
};

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1877F2', // Facebook blue
    },
    secondary: {
      main: '#42B72A', // Facebook green
    },
    background: {
      default: '#F0F2F5', // Facebook light gray background
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const facebookHook = useFacebook();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FacebookContext.Provider value={facebookHook}>
        <Router />
      </FacebookContext.Provider>
    </ThemeProvider>
  );
}

export default App;