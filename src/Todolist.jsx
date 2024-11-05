import React, { useState, useEffect } from "react";
import useLocalStorage from "./components/useLocalStorage";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [setTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    if (taskInput) {
      const newTask = {
        title: taskInput,
        completed: false,
        date: taskDate,
      };

      try {
        if (editingTaskId) {
          await updateDoc(doc(db, "tasks", editingTaskId), newTask);
          setEditingTaskId(null);
        } else {
          await addDoc(collection(db, "tasks"), newTask);
        }
        setTaskInput("");
        setTaskDate("");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await updateDoc(doc(db, "tasks", id), { completed: !completed });
    } catch (error) {
      console.error("Error toggling task: ", error);
    }
  };

  const startEditTask = (task) => {
    setTaskInput(task.title);
    setTaskDate(task.date);
    setEditingTaskId(task.id);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
        email: userCredential.user.email,
      });
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setError("");
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setTasks([]);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">
          {isSignUp ? "Sign Up" : "Login"}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            className="p-2 bg-gray-600 text-white border border-gray-500 rounded-md"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-2 bg-gray-600 text-white border border-gray-500 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 mt-2"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </form>
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
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">To-Do App</h1>
      <button
        onClick={handleLogout}
        className="mb-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
      <form onSubmit={addTask} className="flex gap-2 mb-4 w-full max-w-md">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task"
          className="flex-1 p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {editingTaskId ? "Update" : "Add"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-600 bg-gray-700 text-white rounded-md mb-4 w-full max-w-md"
      />

      <select
        onChange={(e) => setSortOption(e.target.value)}
        className="mb-4 p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
      >
        <option value="date">Sort by Date</option>
        <option value="completed">Sort by Completion</option>
      </select>

      <div className="mb-4 text-white">
        <span>Total tasks: {tasks.length}</span> |
        <span> Completed: {tasks.filter((task) => task.completed).length}</span>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-gray-700 p-2 rounded-md shadow-md"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                className="w-4 h-4 text-blue-500 bg-gray-800"
              />
              <span
                className={`${
                  task.completed ? "line-through text-gray-400" : "text-white"
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
                className="text-green-400 hover:text-green-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-300"
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
