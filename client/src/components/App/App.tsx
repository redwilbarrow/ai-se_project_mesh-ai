import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "../ProtectedRoute/ProtectedRoute";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import Intro from "../../pages/Intro/Intro";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Chat from "../../pages/Chat/Chat";
import "./App.css";
import AppLayout from "../AppLayout/AppLayout";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/"
        element={
          <div className="app">
            <Intro />
          </div>
        }
      ></Route>
      <Route element={<AppLayout />}>
        {" "}
        <Route element={<ProtectedRoute />}>
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
