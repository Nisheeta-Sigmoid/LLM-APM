import { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/ChatMessage";

export default function Chatbot({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          max_tokens: 300,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* AREA BELOW NAVBAR ONLY */
    <div className="h-[calc(100vh-64px)] mt-16 bg-zinc-100 overflow-hidden flex items-center justify-center">
      
      {/* CHAT CONTAINER */}
      <div className="w-full max-w-3xl h-full flex flex-col bg-slate-200">

        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 w-full">
            <h1 className="text-3xl font-semibold text-zinc-800 mb-8">
              What can I help with?
            </h1>

            <div className="w-full bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
              <input
                className="flex-1 outline-none text-zinc-700"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center"
              >
                ↑
              </button>
            </div>
          </div>
        )}

        {/* CHAT STATE */}
        {messages.length > 0 && (
          <div className="flex flex-col w-full h-full">

            {/* MESSAGES — ONLY THIS SCROLLS */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}

              {loading && (
                <ChatMessage role="assistant" content="Thinking…" />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR */}
            <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3 mx-4 mb-6">
              <input
                className="flex-1 outline-none text-zinc-700"
                placeholder="Ask anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50"
              >
                ↑
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
