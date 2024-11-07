import React from "react";
import "./App.css";
import Todolist from "./Todolist";
import { TaskProvider } from "./TaskContext";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <TaskProvider>
          <Todolist />
        </TaskProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
