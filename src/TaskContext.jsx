import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const userTasksRef = collection(db, "users", user.uid, "tasks");
    const unsubscribe = onSnapshot(userTasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (newTask) => {
    if (!user) return;
    try {
      const userTasksRef = collection(db, "users", user.uid, "tasks");
      await addDoc(userTasksRef, newTask);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (id) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const toggleTask = async (id, completed) => {
    if (!user) return;
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, { completed: !completed });
    } catch (error) {
      console.error("Error toggling task: ", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
};
