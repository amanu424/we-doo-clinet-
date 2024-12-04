import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios'
// Create the context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is logged in
  const [user, setUser] = useState(null); // Track if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    const parsedUser = JSON.parse(userData)
    if(t && parsedUser) {
      setIsAuthenticated(true)
      setUser(parsedUser)
      navigate("/tasks")
    } else {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    }
  }, [])


  const login = async (name) => {
    try {
      const response = await axiosInstance.post('/login', name)
      const { token, user } = response.data

      localStorage.setItem('authToken', token); // Save token to localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Save token to localStorage
      setIsAuthenticated(true);
      setUser(user)
      navigate('/tasks'); // Redirect to dashboard after login
  
    } catch (err) {
      console.log(err)
      alert(err.response.data.error)
      console.log("Login Failed")
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
