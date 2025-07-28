import React, { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

export default function AIChatAssistant({ currVal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I'm your Trading Assistant 🤖" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          current_price: currVal || "Not Available",
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "ai", text: "⚠️ Error fetching response from AI." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-110 transition"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl border overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
            🤖 AI Trading Assistant
          </div>

          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "ai"
                    ? "bg-gray-200 text-black self-start"
                    : "bg-blue-500 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about trading..."
              className="flex-1 border rounded-lg px-3 py-1 text-sm"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
