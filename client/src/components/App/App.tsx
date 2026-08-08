import { Routes, Route } from "react-router-dom";
import Intro from "../../pages/Intro/Intro";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Chat from "../../pages/Chat/Chat";
import "./App.css";
import AppLayout from "../AppLayout/AppLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
            <Intro />
          </div>
        }
      ></Route>
      <Route element={<AppLayout />}>
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
