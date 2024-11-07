import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      setUser(userCredential.user);
      setError("");
    } catch (error) {
      setError("Error creating user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      setUser(userCredential.user);
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
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
