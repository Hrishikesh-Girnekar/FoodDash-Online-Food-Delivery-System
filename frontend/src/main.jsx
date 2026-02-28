import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <App />
              <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                  duration: 3500,
                  style: {
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  },
                  success: {
                    iconTheme: { primary: '#f97316', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  },
                }}
              />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
