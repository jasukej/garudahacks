import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Navbar from './components/Navbar.tsx'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import SummarizeModal from './components/modals/SummarizeModal.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <Navbar />
      <SummarizeModal />
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
