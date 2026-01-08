import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import Header from "./components/Header";

export default function App() {
  const [messages, setMessages] = useState([]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Chat messages={messages} setMessages={setMessages} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard messages={messages} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
