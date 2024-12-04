import React from 'react';
import { useState } from 'react'
import { AppBar, Toolbar, Slide, IconButton, Button, Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = (props) => {
  const location = useLocation()
  const { logout } = useAuth()
  // const [currentTab, setCurrentTab] = useState(location.pathname)     // this is for browsers
  const [currentTab, setCurrentTab] = useState("/")
  const [currentIndex, setCurrentIndex] = useState(1)
  const [prvTabIndex, setPrvTabIndex] = useState(null)
  

  const handleClick = (tab, index) => {
    setCurrentTab(tab)
    setPrvTabIndex(currentIndex)
    setCurrentIndex(index)
  }

  const buttons = [
    { path: '/messages', name: "Messages" },
    { path: '/', name: "Today's Taks" },
    { path: '/profile', name: "Proflile" }
  ]

  return (
    <>
      <AppBar position="static" sx={{bgcolor: "white"}}>
        <Toolbar>
          <Box className="pt-10 h-20 flex justify-between w-full">

            { buttons.map((button, index) => (
              <Typography 
                key={index} 
                onClick={() => handleClick(button.path, index)} 
                className={`cursor-pointer text-white text-gray-500 nav-link 
                  ${button.path === currentTab ? 'active' : ''}`}
                sx={{
                  color: 'gray',
                  position: 'relative',
                  textTransform: 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'black',
                    transform: 'scaleX(0)',

                    transition: 'transform .3s ease-out',
                    transformOrigin: `${currentIndex < prvTabIndex ? 'left' : 'right'}`, //moving left to right if curent index(new index) is less than previos index.

                  },
                  '&.active': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'black',
                    transition: 'font .1s ease-out',
                  },
                  // Animate the border-bottom when the button is active
                  '&.active::after': {
                    transform: 'scaleX(1)',
                    
                    transformOrigin: `${currentIndex < prvTabIndex ? 'right' : 'left'}`, //moving left to right if curent index(new index) is less than previos index.
                  },
                }}       
              > 
                <Link className="pb-3"
                 to={`${button.path}`}>
                  {button.name}     
                </Link>
              </Typography>
            ))}
          </Box>
      </Toolbar>
          <Button onClick={logout} variant="contained" size="small" className="bg-red-300"
           style={{ position: 'fixed', bottom: 1, right: 1, backgroundColor: 'red', opacity: '.8', zIndex: '3000'}}>
            Logout
          </Button>
    </AppBar>
    {/*<header className="px-6 pt-8 flex justify-between items-end bg-white" id="header">
      <p onClick={handleClick} className="cursor-pointer text-gray-500 nav-link pb-3" data-section="messages"> Messages </p>      
      <p className="cursor-pointer text-gray-500 nav-link pb-3 active-nav" data-section="tasks"> Today Tasks </p>
      <div className="cursor-pointer text-gray-500 nav-link pb-3" data-section="contacts"> Contacts </div>
    </header>*/}
    </>
  )
}

export default Header;