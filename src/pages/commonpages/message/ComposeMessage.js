import React, { useState } from "react";

const ComposeMessage = ({ onCancel, onSend }) => {
  const [toEmails, setToEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16));

  const handleAddEmail = () => {
    if (emailInput && !toEmails.includes(emailInput)) {
      setToEmails([...toEmails, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email) => {
    setToEmails(toEmails.filter((e) => e !== email));
  };

  const handleSubmit = () => {
  if (toEmails.length === 0 || !message.trim()) return;

  const startTimeISO = new Date(startDate).toISOString();
  const endTimeISO = new Date(endDate).toISOString();

  console.log("Sending message:", {
    to: toEmails,
    content: message,
    startTime: startTimeISO,
    endTime: endTimeISO,
  });

  onSend({
    to: toEmails,
    content: message,
    startTime: startTimeISO,
    endTime: endTimeISO,
  });
};

  return (
    <div
      className="card shadow p-4 w-100 mx-auto"
      style={{ width: "100%", maxWidth: "1200px" }}
    >
      <h5 className="mb-3">
        <i className="bi bi-pencil-square me-2"></i> Compose Message
      </h5>

      <div className="mb-3">
        <label className="form-label">To:</label>
        <div className="d-flex gap-2">
          <input
            type="email"
            className="form-control"
            placeholder="Enter email..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button
            className="btn btn-success"
            type="button"
            onClick={handleAddEmail}
          >
            +
          </button>
        </div>
        <div className="mt-2">
          {toEmails.map((email) => (
            <span key={email} className="badge text-bg-secondary me-2">
              {email}
              <button
                type="button"
                className="btn btn-sm btn-close ms-2"
                onClick={() => handleRemoveEmail(email)}
              ></button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Message:</label>
        <textarea
          className="form-control"
          rows="6"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label d-block">Time Range:</label>
        <div className="d-flex flex-column flex-md-row gap-3">
          <div>
            <label className="form-label small">Start:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label small">End:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          <i className="bi bi-send-fill me-2"></i> Send
        </button>
      </div>
    </div>
  );
};

export default ComposeMessage;
