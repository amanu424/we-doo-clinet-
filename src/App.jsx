import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute'; // For protecting the dashboard route
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import './App.css'
import Header from './components/Header'
import Tasks from './components/Tasks'
import Profile from './components/Profile'
import Login from './components/Login'

const queryClient = new QueryClient()

const theme = createTheme({
  typography: {
    fontFamily: '"Quicksand", sans-serif'
  },
  button: {
    fontFamily: '"Quicksand", sans-serif',
  }
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
      <AuthProvider>
          <div id="error" className="absolute opacity-0 transition-opacity duration-500 bottom-2 z-50 right-1/2 translate-x-1/2 bg-black px-3 py-1 rounded text-red-400 text-sm"> </div>
          <div id="msg" className="absolute opacity-0 transition-opacity duration-500 bottom-2 z-50 right-1/2 translate-x-1/2 bg-green-800 px-3 py-1 rounded text-white text-sm"> </div>
          <div className="relative bg-white body-container rounded">      
          <ProtectedRoute>
            <Header />  
          </ProtectedRoute>
            <main className="px-5 py-8">
              <Routes>
                <Route path="" element={
                  <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                  }
                />
                <Route path='/profile' element={<Profile />} />
                <Route path='/messages' element={<Profile />} />
                <Route path="*" element={
                  <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
      </AuthProvider>
        </Router>

      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App