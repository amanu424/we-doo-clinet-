import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

import axiosInstance from "../api/axios";
const Profile = (props) => {
    const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/profile");
      return response.data.data;
    } catch (err) {
      alert("Error fetching profile");
      console.log(err);
    }
  };

  if(!user) {
    return (<h1 style={{color: 'red'}}> Login To Access This Page </h1>)
  }
  const { data, isPending, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return (
    <>
      <h1 className="font-bold text-2xl">Profile</h1>
      {user && data && (
        <>
          <h2> Hi, Mname is... mName is {data.profile.name} </h2>
          <h4>
            {" "}
            I have completed{" "}
            {
              data.tasks.filter((task) => task.status === "completed").length
            }{" "}
            tasks
          </h4>
          <ul>
            {data.tasks.map((task) => (
              <li key={task._id}>
                {" "}
                {task.name} ({task.status})
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Profile;
