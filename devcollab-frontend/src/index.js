// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store'; // <-- Import our store
import { Provider } from 'react-redux'; // <-- Import the Provider
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { SocketProvider } from './context/SocketContext.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);