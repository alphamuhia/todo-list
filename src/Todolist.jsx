import React, { useState } from "react";
import { useTasks } from "./TaskContext";
import { useAuth } from "./AuthContext";

function Todolist() {
  const { tasks, addTask, deleteTask, toggleTask } = useTasks();
  const {
    isLoggedIn,
    handleSignUp,
    handleLogin,
    handleLogout,
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
  } = useAuth();

  const [taskInput, setTaskInput] = useState("");
  const [taskDate, setTaskDate] = useState("");

  if (!isLoggedIn) {
    return (
      <div>
        <h1>{loading ? "Loading..." : "Login"}</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    );
  }

  const handleAddTask = (e) => {
    e.preventDefault();
    addTask({ title: taskInput, date: taskDate, completed: false });
    setTaskInput("");
    setTaskDate("");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task"
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
            />
            {task.title} - {task.date}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todolist;
