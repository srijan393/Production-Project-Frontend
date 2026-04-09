import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomeFeed from "./pages/HomeFeed";
import CreatePost from "./pages/CreatePost";
import Discover from "./pages/Discover";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PostDetails from "./pages/PostDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  );
}