import Form from './Form';
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { AppBar, Toolbar, Slide, IconButton, Button, Typography, Box } from '@mui/material'

const Login = () => {
	const { login } = useAuth()
const [formData, setFormData] = useState({ name: '' })

  const handleInputChange = (e) => {
  	const { name, value } = e.target
  	setFormData(prvData => ({
  		...prvData, [name]: value
  	}))
  }

  const handleFormSubmit = (e) => {
  	e.preventDefault()
  	login(formData)
  }
  return (
  	<>
   			<div className={`visible z-10 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000"`} id="overlay"></div>
	    	<form 
	    		onSubmit={handleFormSubmit} 
	    		className={`visible inset-0 bg-white mx-5 px-5 py-8 z-10 rounded-lg border border-gray-300 transition-opacity duration-1000"`} id="form">
		    	<div className="mb-4">
		    		<h2 className="font-bold text-lg text-center"> Weclome </h2>
		    	</div>
		    	<div className="mb-4">
		    		<label className="block text-gray-600"> Usrename </label>
		    		<input onChange={handleInputChange} value={formData.name} type="text" name="name" className="w-full border border-gray-300 p-2 mt-1 rounded focus:ring focus:ring-blue-300 focus:outline-none" />
		    	</div>
		    	
		    	<Button type="submit" varient="contained" sx={{ bgcolor: "black", fontWeight: 'bold', color: 'white'}} className="w-full bg-blue-500 text-black p-2 rounded-lg hover:bg-gray-600 hover:text-white transition"> Loign </Button>
	    	</form>
  	</>

  )
}

export default Login;