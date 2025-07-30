import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MessageCard = ({
  message,
  currentUserEmail,
  onDelete,
  onStatusChange,
}) => {
  const handleAccept = () => onStatusChange("ACCEPTED");
  const handleDeny = () => onStatusChange("DENIED");

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body position-relative">
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={onDelete}
          aria-label="Close"
        ></button>

        <h6 className="text-muted">
          {message.from === currentUserEmail ? (
            <>To: {message.to?.[0]}</>
          ) : (
            <>From: {message.from}</>
          )}
        </h6>

        <p>{message.content}</p>
        <p className="text-muted small">{message.timeRange}</p>

        {message.status === "PENDING" &&
        Array.isArray(message.to) &&
        message.to.includes(currentUserEmail) ? (
          // Only show buttons if it's pending and you're the recipient
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={handleAccept}
            >
              <FaCheckCircle className="me-1" /> Accept
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDeny}
            >
              <FaTimesCircle className="me-1" /> Deny
            </button>
          </div>
        ) : (
          <span
            className={`badge ${
              message.status === "ACCEPTED"
                ? "bg-success"
                : message.status === "DENIED"
                ? "bg-danger"
                : "bg-secondary"
            }`}
          >
            {message.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
