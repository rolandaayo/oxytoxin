"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { messageApi } from "../services/api";
import toast from "react-hot-toast";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    if (email) {
      fetchUnreadCount();
      // Poll for new messages every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (isOpen && userEmail) {
      loadConversation();
    }
  }, [isOpen, userEmail]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUnreadCount = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      const count = await messageApi.getUnreadCount(email);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const loadConversation = async () => {
    try {
      setLoading(true);
      const conversation = await messageApi.getConversation(userEmail);
      setMessages(conversation.messages || []);

      // Mark admin messages as read
      await messageApi.markAsRead(userEmail, "admin");
      setUnreadCount(0);
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !userEmail) return;

    try {
      const conversation = await messageApi.sendMessage(
        userEmail,
        newMessage.trim()
      );
      setMessages(conversation.messages || []);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Don't show widget if user is not logged in
  if (!userEmail) return null;

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -10, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-blue-500/50 transition-all cursor-pointer"
            style={{
              boxShadow:
                "0 10px 40px rgba(59, 130, 246, 0.4), 0 0 0 0 rgba(59, 130, 246, 0.4)",
              animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaComments className="w-7 h-7" />
            </motion.div>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add CSS for pulse ring animation */}
      <style jsx>{`
        @keyframes pulse-ring {
          0%,
          100% {
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4),
              0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.6),
              0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxWidth: "calc(100vw - 3rem)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaComments className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Oxytoxin Support</h3>
                  <p className="text-xs text-blue-100">We're here to help!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-md rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
