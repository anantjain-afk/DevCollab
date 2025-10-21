// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store'; // <-- Import our store
import { Provider } from 'react-redux'; // <-- Import the Provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the entire App in the Provider and pass it our store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);