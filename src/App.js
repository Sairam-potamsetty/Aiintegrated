// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const res = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: prompt,
        stream: false, // If your backend supports streaming, update accordingly
      });

      const botMessage = { sender: "bot", text: res.data.response || res.data.choices?.[0]?.message?.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: " + err.message }]);
    }
  };

  return (
    <div className="app">
      <h1>Chat with AI</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
