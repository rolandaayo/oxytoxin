"use client";

import { useState, useEffect, useRef } from "react";
import { messageApi } from "../../services/api";
import toast from "react-hot-toast";
import { FaPaperPlane, FaCheck, FaCheckDouble, FaTimes } from "react-icons/fa";

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const data = await messageApi.getAllConversations(filterStatus);
      setConversations(data);

      // Calculate total unread
      const unreadTotal = data.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0
      );
      setTotalUnread(unreadTotal);

      // Update selected conversation if it exists
      if (selectedConversation) {
        const updated = data.find(
          (c) => c.userEmail === selectedConversation.userEmail
        );
        if (updated) {
          setSelectedConversation(updated);
          // Mark user messages as read
          await messageApi.markAsRead(updated.userEmail, "user");
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    // Mark user messages as read
    try {
      await messageApi.markAsRead(conversation.userEmail, "user");
      await loadConversations();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const updated = await messageApi.sendAdminReply(
        selectedConversation.userEmail,
        newMessage.trim()
      );
      setSelectedConversation(updated);
      setNewMessage("");
      await loadConversations();
      toast.success("Reply sent!");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    try {
      await messageApi.closeConversation(selectedConversation.userEmail);
      toast.success("Conversation closed");
      setSelectedConversation(null);
      await loadConversations();
    } catch (error) {
      console.error("Error closing conversation:", error);
      toast.error("Failed to close conversation");
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

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return "No messages";
    const last = messages[messages.length - 1];
    return last.message.length > 50
      ? last.message.substring(0, 50) + "..."
      : last.message;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">
                Customer Messages
              </h2>
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {totalUnread} New
                </span>
              )}
            </div>
            <p className="text-blue-100 text-sm mb-3">
              {conversations.length}{" "}
              {conversations.length === 1 ? "conversation" : "conversations"}
            </p>
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-white text-blue-600"
                    : "bg-blue-400 text-white hover:bg-blue-300"
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setFilterStatus("open")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "open"
                    ? "bg-white text-blue-600"
                    : "bg-blue-400 text-white hover:bg-blue-300"
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilterStatus("closed")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  filterStatus === "closed"
                    ? "bg-white text-blue-600"
                    : "bg-blue-400 text-white hover:bg-blue-300"
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No conversations</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${
                    selectedConversation?.userEmail === conv.userEmail
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {conv.userName}
                    </h3>
                    {conv.unreadCount > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{conv.userEmail}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessage(conv.messages)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        conv.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedConversation.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.userEmail}
                  </p>
                </div>
                <button
                  onClick={handleCloseConversation}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedConversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.sender === "admin"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow-md rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs ${
                            msg.sender === "admin"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.sender === "admin" && (
                          <span className="ml-2">
                            {msg.read ? (
                              <FaCheckDouble className="w-3 h-3 text-blue-200" />
                            ) : (
                              <FaCheck className="w-3 h-3 text-blue-200" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendReply}
                className="p-4 bg-white border-t border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
