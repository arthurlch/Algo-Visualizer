import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
