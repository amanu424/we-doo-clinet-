import { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tab,
  Tabs,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import TaskForm from "./Form";
import TaskCard from "./TaskCard";

const Tasks = () => {
  const [filter, setFilter] = useState("all");
  const [value, setValue] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [openForm, setOpenForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const n = new Date();

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      if (response.status === 200) {
        return response.data.data;
      }

      // throw response.data.data.error;
      throw new Error("Error Creating a task");
    } catch (err) {
      console.log(err?.response?.data?.error);
      setOpenSnackbar(true);
      setMessage("Network Error. Try Again");
      console.log(err);
    }
  };

  const postTask = async (body) => {
    try {
      const response = await axiosInstance.post("/tasks", body);
      if (response.status !== 201) {
        throw response.data.error;
      }

      return response.data;
    } catch (err) {
      console.log(err);
    }
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (body) => await axiosInstance.post("/tasks", body),
    onSuccess: (data) => {
      setTasks(data.data.data);
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== undefined)
      );
      setMessage("Error Occured");
      setMessageType("error");
      setOpenSnackbar(true);
      console.error("Error creating task:", err);
    },
  });

  const {
    data: testData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    setTasks(testData);
  }, [testData]);

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "600px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "600px",
        }}
      >
        <h6 className="text-red-400">Network Error</h6>
      </Box>
    );
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChange = (event, newValue, message) => {
    setValue(newValue);
  };

  const handleTaskUpdate = (updatedTask, remove) => {
    if (remove) {
      return setTasks(updatedTask);
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskCreation = (newTask) => {
    try {
      setTasks((prevTasks) => [
        {
          status: "free",
          user: null,
          name: newTask.name,
        },
        ...prevTasks,
      ]);
      mutation.mutate(newTask);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleOnAddTask = () => {
    setOpenForm(true);
  };

  const toggleOffAddTask = () => {
    setOpenForm(false);
  };

  const filterdTasks = tasks?.filter((task) =>
    filter === "all"
      ? true
      : filter === "taken" && task.status == "taken"
      ? task.user._id == user?._id || task.status === 'taken'
      : task.status === filter
  );

  return (
    <>
      {isAuthenticated && (
        <TaskForm
          clicked={openForm}
          closeOverlay={toggleOffAddTask}
          handleTaskCreation={handleTaskCreation}
        />
      )}

      <div className="flex space-x-10 items-center justify-between">
        <div className="">
          <h1 className="font-bold text-2xl">Tasks</h1>
          <p className="text-sm text-gray-500">
            {n.toString().split(" ").slice(0, 4).join(" ")}
          </p>
        </div>
        {isAuthenticated ? (
          <Button
            disabled={openForm}
            variant="contained"
            size="large"
            onClick={toggleOnAddTask}
            sx={{ textTransform: "capitalize", px: 2 }}
            id="add-task"
            startIcon={<Add />}
          >
            Add Task
          </Button>
        ) : (
          <Button variant="contained">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        className="flex justify-between font-bold text-gray-500 px-1 border-b border-gray-300 my-2 py-3 w-full options"
        id="task-filters"
      >
        <Tab
          label="All Tasks"
          sx={{ textTransform: "capitalize" }}
          onClick={() => setFilter("all")}
        />
        <Tab
          label="Free"
          sx={{ textTransform: "capitalize" }}
          onClick={() => setFilter("free")}
        />
        <Tab
          label="Taken"
          sx={{ textTransform: "capitalize" }}
          onClick={() => setFilter("taken")}
        />
        <Tab
          label="Completed"
          sx={{ textTransform: "capitalize" }}
          onClick={() => setFilter("completed")}
        />
      </Tabs>
      <Box className="grid grid-cols-1 gap-5 my-5 py-3" id="cards">
        {tasks?.length > 0 &&
          filterdTasks &&
          filterdTasks.map((task, index) => (
            <TaskCard
              key={task._id || index}
              data={task}
              allTasks={tasks}
              onDataUpdate={handleTaskUpdate}
            />
          ))}
      </Box>

      <Snackbar
        key="123"
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={messageType} onClose={handleCloseSnackbar}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Tasks;
