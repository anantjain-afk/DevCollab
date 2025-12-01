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
import ClickSpark from './components/clickSpark.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SocketProvider>
<ClickSpark
  sparkColor='#000'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
          <App />
</ClickSpark>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);