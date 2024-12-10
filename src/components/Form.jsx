import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

import { useAuth } from "../context/AuthContext";

const Form = ({ clicked, closeOverlay, taskId, handleTaskCreation }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    uploadedBy: user._id,
    status: "free",
    name: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prvData) => ({
      ...prvData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleTaskCreation({ ...formData });

    setFormData({
      name: "",
      status: "free",
      user: null,
      uploadedBy: user._id,
    });
    closeOverlay();
  };

  return (
    <>
      <div
        onClick={closeOverlay}
        className={`${
          clicked ? "visible" : "hidden"
        } z-10 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000"`}
        id="overlay"
      ></div>
      <form
        onSubmit={handleFormSubmit}
        className={`${
          clicked ? "visible" : "hidden"
        } inset-0 bg-white mx-5 px-5 py-8 z-10 rounded-lg border border-gray-300 transition-opacity duration-1000"`}
        id="form"
      >
        <div className="mb-4">
          <h2 className="font-bold text-lg text-center"> Add New Task </h2>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600"> Task Name </label>
          <input
            onChange={handleInputChange}
            value={formData.name}
            type="text"
            name="name"
            className="w-full border border-gray-300 p-2 mt-1 rounded focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="mb-4 hidden">
          <label className="block text-gray-600"> Status </label>
          <input
            type="text"
            name="status"
            value="free"
            disabled
            className="w-full border border-gray-300 p-2 mt-1 rounded focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <Button
          type="submit"
          varient="contained"
          sx={{ bgcolor: "gray", fontWeight: "bold", color: "white" }}
          className="w-full bg-blue-500 text-black p-2 rounded-lg hover:bg-gray-600 hover:text-white transition"
        >
          {" "}
          Submit{" "}
        </Button>
      </form>
    </>
  );
};

export default Form;
