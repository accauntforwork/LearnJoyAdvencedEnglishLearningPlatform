// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
// import GrammarSection from "./components/GrammarSection";
import VocabularySection from "./components/VocabularySection";
import ListeningSection from "./components/ListeningSection";
import ReadingSection from "./components/ReadingSection";
import SpeakingSection from "./components/SpeakingSection";
import WritingSection from "./components/WritingSection";
import NotFound from "./components/NotFound";
import Chatbot from "./components/Chatbot";

function App() {
  const [language, setLanguage] = useState("uz");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ username: currentUser.email, uid: currentUser.uid });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "uz" ? "en" : "uz");
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar
          language={language}
          toggleLanguage={toggleLanguage}
          user={user}
          handleLogout={handleLogout}
        />
        <div className="container mx-auto p-4">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Login language={language} onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to="/" /> : <Register language={language} />
              }
            />
            <Route
              path="/"
              element={
                user ? (
                  <Dashboard language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/writing"
              element={
                user ? (
                  <WritingSection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* <Route
              path="/grammar"
              element={
                user ? (
                  <GrammarSection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            /> */}
            <Route
              path="/vocabulary"
              element={
                user ? (
                  <VocabularySection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/chatbot"
              element={user ? <Chatbot /> : <Navigate to="/login" />}
            />
            <Route
              path="/listening"
              element={
                user ? (
                  <ListeningSection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/reading"
              element={
                user ? (
                  <ReadingSection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/speaking"
              element={
                user ? (
                  <SpeakingSection language={language} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* 404 Page Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
