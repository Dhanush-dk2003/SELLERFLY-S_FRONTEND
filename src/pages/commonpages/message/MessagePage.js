import React, { useState, useContext, useEffect } from "react";
import Snackbar from "../../../components/Snackbar";
import { AuthContext } from "../../../contexts/AuthContext";
import MessageCard from "./MessageCard";
import ComposeMessage from "./ComposeMessage";
import Sidebar from "../Sidebar";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  fetchInboxMessages,
  sendMessage,
  deleteMessage,
  updateMessageStatus,
} from "./messagesapi";

const MessagePage = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const { user } = useContext(AuthContext);
  const currentUserEmail = user?.officialEmail;

  // 🔔 Request notification permission once
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 🔔 Show browser notification
  const notifyUser = (msg) => {
    if (Notification.permission === "granted") {
      new Notification("📩 New Message", {
        body: `${msg.from} sent: ${msg.content}`,
        icon: "/logo192.png",
      });
    }
  };


  // Snackbar helper
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
  };

  // 🔄 Initial load of messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchInboxMessages();
        setMessages(data);
      } catch (err) {
        showSnackbar("Failed to load messages", "error");
      }
    };
    loadMessages();
  }, []);

  // 🔄 Polling for new messages every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchInboxMessages();
        setMessages((prev) => {
          if (data.length > prev.length) {
            const newMsg = data[0];
            // Notify only if message is for current user
            if (newMsg.to === currentUserEmail) {
              notifyUser(newMsg);
              
            }
          }
          return data;
        });
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentUserEmail]);

  // 🗑️ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete the message?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      showSnackbar("Message deleted", "warning");
      navigate("/message");
    } catch (err) {
      showSnackbar("Failed to delete message", "error");
    }
  };

  // ✉️ Send handler
  const handleSend = async (newMsg) => {
    try {
      const savedMsg = await sendMessage(newMsg);
      setMessages((prev) => [savedMsg, ...prev]);
      setShowCompose(false);
      showSnackbar("Message sent", "success");

      // Notify only if the recipient is the current user (optional)
      if (savedMsg.to === currentUserEmail) {
        notifyUser(savedMsg);
      }
    } catch (err) {
      showSnackbar("Failed to send message", "error");
    }
  };

  // ❌ Cancel handler
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the compose?")) {
      setShowCompose(false);
      showSnackbar("Message composition cancelled", "warning");
      navigate("/message");
    }
  };

  // 🔄 Status change handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );
      showSnackbar(
        `Message ${newStatus === "ACCEPTED" ? "accepted" : "denied"}`,
        newStatus === "ACCEPTED" ? "success" : "warning"
      );
    } catch {
      showSnackbar("Failed to update message", "error");
    }
  };

  // 🔴 Show red dot in sidebar if any message is pending
  const hasPendingMessageDot = messages.some(
    (msg) => msg.status === "PENDING" || msg.status === undefined
  );

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar hasPendingMessageDot={hasPendingMessageDot} />

      <div
        className="flex-grow-1 px-3 py-4 mb-4 mt-4"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0",
          marginRight: isLargeScreen ? "50px" : "0",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h1 className="mb-4 mt-4">Message Box</h1>
          <button
            className="btn btn-outline-dark mt-2 mt-md-0 d-flex align-items-center"
            onClick={() => setShowCompose(true)}
          >
            <span role="img" aria-label="compose">✏️</span>
            <span className="ms-2 d-none d-md-inline">Compose</span>
          </button>
        </div>

        {showCompose ? (
          <ComposeMessage onCancel={handleCancel} onSend={handleSend} />
        ) : messages.length === 0 ? (
          <p className="text-muted mt-4">No messages available.</p>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.id}
              message={msg}
              currentUserEmail={currentUserEmail}
              onDelete={() => handleDelete(msg.id)}
              onStatusChange={(status) => handleStatusChange(msg.id, status)}
            />
          ))
        )}
      </div>

      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default MessagePage;
