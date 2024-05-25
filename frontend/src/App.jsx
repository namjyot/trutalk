import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import GroupChat from "./pages/GroupChat";
import Profile from "./pages/Profile";
import ChatState from "./context/ChatState";
import axios from "axios";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChatState>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/groupchat" element={<GroupChat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ChatState>
  );
}

export default App;
