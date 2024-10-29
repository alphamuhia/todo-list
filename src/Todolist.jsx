import React, { useState, useEffect } from "react";
import useLocalStorage from "./components/useLocalStorage";

function Todolist() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [taskInput, setTaskInput] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [sortOption, setSortOption] = useState("date");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (taskInput) {
      const newTask = {
        id: Date.now(),
        title: taskInput,
        completed: false,
        date: taskDate,
      };

      if (editingTaskId) {
        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId ? { ...newTask, id: editingTaskId } : task
          )
        );
        setEditingTaskId(null);
      } else {
        setTasks([...tasks, newTask]);
      }

      setTaskInput("");
      setTaskDate("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditTask = (task) => {
    setTaskInput(task.title);
    setTaskDate(task.date);
    setEditingTaskId(task.id);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "peter" && password === "Alpha") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-black p-4">
        <h1 className="text-3xl font-bold text-gray-600 mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-col item-center bg-gray-400 border border border-gray-700 rounded-md p-8">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-2 mb-4 w-full max-w-md"
          >
            <p className="text-gray-900 bg-blue-300">username : peter</p>
            <p className="text-gray-900 bg-blue-300">password : Alpha</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="p-2 bg-gray-300 border border border-none rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-2 bg-gray-300 border border-none rounded-md"
            />
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sortedTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "completed") {
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      }
      return new Date(a.date) - new Date(b.date);
    });
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-600 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 bg-gray-300">
        To-Do App
      </h1>

      <form
        onSubmit={addTask}
        className="flex gap-2 mb-4 w-full max-w-md bg-aqua-900"
      >
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task"
          className="flex-1 p-2 border border-gray-900 rounded-md"
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="p-2 border border-gray-900 rounded-md"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          {editingTaskId ? "Update" : "Add"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-900 rounded-md mb-4 w-full max-w-md"
      />

      <select onChange={(e) => setSortOption(e.target.value)} className="mb-4">
        <option value="date">Sort by Date</option>
        <option value="completed">Sort by Completion</option>
      </select>

      <div className="mb-4">
        <span>Total tasks: {tasks.length}</span> |
        <span> Completed: {tasks.filter((task) => task.completed).length}</span>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-white p-2 rounded-md shadow-md"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4"
              />
              <span
                className={`${
                  task.completed ? "line-through text-red-700" : ""
                }`}
              >
                {task.title}{" "}
                <span className="text-gray-400">
                  ({new Date(task.date).toLocaleDateString()})
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEditTask(task)}
                className="text-green-700 bg-green-400 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 bg-red-300 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todolist;
