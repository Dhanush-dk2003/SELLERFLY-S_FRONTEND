import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchInboxMessages } from "../pages/commonpages/message/messagesapi";
import { AuthContext } from "./AuthContext";

export const MessageStatusContext = createContext();

export const MessageStatusProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [hasPendingMessageDot, setHasPendingMessageDot] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const currentUserEmail = user?.email;

  const showSnackbar = (message, type = "success") => {
    setSnackbarData({ show: true, message, type });
    setTimeout(() => {
      setSnackbarData({ show: false, message: "", type: "success" });
    }, 3000); // Corrected timeout placement
  };

  useEffect(() => {
    if (!currentUserEmail) return;

    let dotInterval;
    let snackbarInterval;

    const checkDotStatus = async () => {
      try {
        const data = await fetchInboxMessages();

        const hasPending = data.some(
          (msg) =>
            msg.status === "PENDING" &&
            msg.to.includes(currentUserEmail) &&
            msg.sender !== currentUserEmail
        );

        setHasPendingMessageDot(hasPending); // Dot updates immediately
      } catch (error) {
        console.error("Dot polling failed:", error);
      }
    };

    const checkSnackbarStatus = async () => {
      try {
        const data = await fetchInboxMessages();

        const hasNew = data.some(
          (msg) =>
            msg.status === "PENDING" &&
            msg.to.includes(currentUserEmail) &&
            msg.sender !== currentUserEmail
        );

        if (hasNew) {
          showSnackbar("New message received or status pending", "warning");
        }
      } catch (error) {
        console.error("Snackbar polling failed:", error);
      }
    };

    // Run both immediately
    checkDotStatus();
    checkSnackbarStatus();

    // Dot updates every 5s for real-time UI (lightweight)
    dotInterval = setInterval(checkDotStatus, 5000);

    // Snackbar shows every 60s if needed
    snackbarInterval = setInterval(checkSnackbarStatus, 60000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(snackbarInterval);
    };
  }, [currentUserEmail]);

  return (
    <MessageStatusContext.Provider value={{ hasPendingMessageDot, snackbarData }}>
      {children}
    </MessageStatusContext.Provider>
  );
};
