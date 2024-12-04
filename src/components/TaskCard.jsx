import { Button, IconButton, ButtonGroup, Tooltip, Alert, Snackbar, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext'
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import PowerInputIcon from '@mui/icons-material/PowerInput';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
const TaskCard = ({ data, onDataUpdate, allTasks }) => {
  const [task, setTask] = useState(data);
  const [tasks, setTasks] = useState(allTasks)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [hovered, setHovered] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth()
  // Update task state when the data prop changes
  useEffect(() => {
    setTask(data);
    setTasks(allTasks)
  }, [data, allTasks]);

  const handleStatusChange = async (newStatus, message) => {
    try {
      const updatedTask = { ...task, status: newStatus, user: { _id: user._id, name: user.name } };

      updateTaskMutation.mutate(updatedTask);
      setTask(updatedTask);
      setMessage(message)
      setMsgType("success")
      setOpenSnackbar(true)
      // Call the parent handler to update the original data
      if (onDataUpdate) {
        onDataUpdate(updatedTask);
      }
    } catch (err) {
      alert("erorro")
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const deleteMutation = useMutation({
    mutationFn: async (taskId) => {
      await axiosInstance.delete(`/tasks/${taskId}`);
      return taskId; // Return taskId to use later
    },
    onSuccess: () => {
      // Invalidate the tasks query to refetch and update the UI
      queryClient.invalidateQueries(['tasks']);
    },
  })

  
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const response = await axiosInstance.patch(`/tasks/${updatedTask.name}`, updatedTask);
      return response
    },
    onSuccess: (data) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data.data._id ? data.data : task))
      );
      setMsgType("success")
      setMessage('Task updated successfully!');
      setOpenSnackbar(true);
    },
    onError: (err) => {
      setMsgType("error")
      setMessage('Error updating task');
      setOpenSnackbar(true);
      window.location.reload();
    }
  });

  const handleDeleteTask = (id, message) => {
    const newTasks = tasks.filter((data) => data._id !== id);
    deleteMutation.mutate(id);
    setTasks(newTasks);
    setMsgType("success")
    setMessage(message)
    setOpenSnackbar(true)

    if (onDataUpdate) {
      onDataUpdate(newTasks, true); //sent true to notify the main function that this is remove function
    }
  }

  return (
    <div
      className={`task relative grid bg-white rounded-lg shadow-md px-5 py-3 border ${task?.status == 'completed' ? 'border-green-200 bg-gray-100 shadow-0' : 'border-blue-200'}`} key={task._id}
    >
      <div className="flex justify-between items-center border-b py-3 border-b-gray-300">
        <div>
          <h2 className={`font-bold ${task.status == 'completed' ? 'text-green-700' : 'text-blue-700'}`}>{task?.name}</h2>
          <p className="text-xs italic text-gray-700 mt-1"> { task.status === 'taken' &&  task?.user?.name ? `${task?.user.name} is working on this. ` : task.status === 'completed' &&  task?.user?.name ? `${task?.user.name} completed this.` : 'free task' } </p>
        </div>
        <div className="group relative">
          {task.status === 'free' ? (
            <Tooltip title={'Click to take the task'} arrow>
              <Button variant="text" onClick={() => handleStatusChange('taken', 'task taken')}>
                <BookmarkAddOutlinedIcon size="small" />
              </Button>
            </Tooltip>
          ) : task.status === 'taken' ? (

            task.user._id === user._id ? 
              <ButtonGroup>
                <Tooltip title={'Click to unsave the task'} arrow>
                  <Button sx={{color: "red"}}  variant="text" onClick={() => handleStatusChange('free', 'task is free now')}>
                    <BookmarkRemoveOutlinedIcon size="small" />
                  </Button>
                </Tooltip>
                <Tooltip title={'Click to mark as complete'} arrow>
                  <Button 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{color: "teal", transition: 'transform .3s ease'}}  variant="text" onClick={() => handleStatusChange('completed', 'task completed')}>
                    {!hovered ? <RadioButtonUncheckedOutlinedIcon size="small" /> : <TaskAltOutlinedIcon sx={{color: "green"}} size="small" />}
                    
                  </Button>
                </Tooltip>
              </ButtonGroup>
              :
              <p className="text-xs bg-blue-200 font-bold px-2 py-1 rounded"> taken </p>
          ) : task.status === 'completed' ? (
            <Tooltip title={'This task is completed'}>
              <TaskAltOutlinedIcon sx={{color: "green"}} size="small" />
            </Tooltip>
          ) : (
            <RadioButtonUncheckedOutlinedIcon size="small" />
          )}
        </div>
      </div>
      <div className="text-gray-500 text-sm py-3">
        <Box className="flex items-center gap-5 pl-5 pb-0 mb-0"  >
          <AirportShuttleIcon size="small" />
          <AgricultureIcon size="small" />
          <DirectionsRunIcon size="small" />
        </Box>      
        <Box className="flex items-center pt-0 -mt-2"  >
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
          <PowerInputIcon size="small" />
        </Box>      
        {/*Place holder for something {task.status.charAt(0).toUpperCase() + task.status.slice(1)}*/}
      </div>

      {
        task.uploadedBy == user._id ? 
          <Tooltip title={'Click to remove this task'} arrow>
            <Close
              onClick={() => handleDeleteTask(task._id, "Task deleted")}
              size="small"
              sx={{ width: 15 }}
              className={`absolute right-1 top-0 w-3 h-3 rounded-full cursor-pointer remove-task`}
            />
          </Tooltip> :
          <></>
      }

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
        >
        <Alert severity={`${msgType}`} onClose={handleCloseSnackbar}> {message} </Alert>
      </Snackbar>
    </div>
  );
};

export default TaskCard;
