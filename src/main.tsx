// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreProvider } from 'easy-peasy'
import store from '@store/index.ts'
import { BrowserRouter } from 'react-router-dom'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </LocalizationProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
)
