import React, { useState, useEffect, useRef } from "react";
import { adminChatMethods, getAllOwnersApi } from "../services/authService";
import { getUser } from "../utils/storage";
import { useUtils } from "../hook/useUtils";
import { Trash2 } from "lucide-react"; // Import Delete Icon
import { toast } from "react-toastify";

const Messages = () => {
  const { getImgURL } = useUtils();
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const admin = getUser();
  const adminId = admin?._id || admin?.id;

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await getAllOwnersApi();
        setOwners(res.owners || res.auths || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  // Poll for messages every 5 seconds
  useEffect(() => {
    let interval;
    if (selectedOwner) {
      fetchHistory();
      interval = setInterval(fetchHistory, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedOwner]);

  const fetchHistory = async () => {
    if (!selectedOwner) return;
    try {
      const res = await adminChatMethods.getHistory(adminId, selectedOwner._id);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedOwner) return;
    const payload = {
      senderId: adminId,
      receiverId: selectedOwner._id,
      message: text,
    };
    try {
      await adminChatMethods.send(payload);
      setText("");
      fetchHistory(); // Refresh immediately
    } catch (err) {
      console.error(err);
    }
  };

  // NEW: DELETE MESSAGE FUNCTION
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await adminChatMethods.deleteMessage(msgId);
      toast.success("Message deleted");
      fetchHistory(); // Refresh list after delete
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="container-fluid p-0"
      style={{ height: "calc(100vh - 150px)" }}>
      <div className="row g-0 h-100 bg-white rounded-4 shadow-sm overflow-hidden border">
        {/* SIDEBAR */}
        <div className="col-md-4 col-lg-3 border-end h-100 d-flex flex-column">
          <div className="p-3 bg-light border-bottom fw-bold text-navy">
            Owner Support
          </div>
          <div className="flex-grow-1 overflow-auto">
            {owners.map((owner) => (
              <div
                key={owner._id}
                onClick={() => setSelectedOwner(owner)}
                className={`p-3 border-bottom d-flex align-items-center cursor-pointer ${selectedOwner?._id === owner._id ? "bg-primary-subtle border-start border-4 border-primary" : ""}`}>
                <img
                  src={getImgURL(owner.profileImage)}
                  className="rounded-circle me-3 border"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div className="overflow-hidden">
                  <div className="fw-bold small text-truncate">
                    {owner.fullName}
                  </div>
                  <div className="text-muted small text-truncate">
                    {owner.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-light">
          {selectedOwner ? (
            <>
              <div className="p-3 bg-white border-bottom d-flex align-items-center">
                <img
                  src={getImgURL(selectedOwner.profileImage)}
                  className="rounded-circle me-3"
                  style={{ width: "35px", height: "35px" }}
                />
                <div className="fw-bold text-navy">
                  {selectedOwner.fullName}
                </div>
              </div>

              {/* MESSAGE LIST */}
              <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-white">
                {messages.map((m, i) => {
                  const mSenderId =
                    typeof m.senderId === "object"
                      ? m.senderId._id
                      : m.senderId;
                  const isMe = mSenderId === adminId;

                  return (
                    <div
                      key={i}
                      className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}>
                      <div className="d-flex align-items-center gap-2 group">
                        {/* Show delete icon only on MY messages */}
                        {isMe && (
                          <button
                            onClick={() => handleDeleteMessage(m._id)}
                            className="btn btn-link p-0 text-danger opacity-0 group-hover-visible"
                            title="Delete message">
                            <Trash2 size={14} />
                          </button>
                        )}

                        <div
                          className={`p-2 px-3 shadow-sm ${isMe ? "bg-navy text-white" : "bg-light border"}`}
                          style={{
                            maxWidth: "100%",
                            borderRadius: isMe
                              ? "15px 15px 0 15px"
                              : "15px 15px 15px 0",
                            backgroundColor: isMe ? "#001f3f" : "",
                          }}>
                          <div>{m.message}</div>
                        </div>
                      </div>
                      <small
                        className="text-muted mt-1"
                        style={{ fontSize: "9px" }}>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <div className="p-3 bg-white border-top">
                <form className="d-flex gap-2" onSubmit={handleSend}>
                  <input
                    className="form-control rounded-pill px-4"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button
                    className="btn btn-primary rounded-circle"
                    type="submit"
                    style={{
                      backgroundColor: "#001f3f",
                      width: "45px",
                      height: "45px",
                    }}>
                    <i className="bi bi-send-fill"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto text-muted">Select an owner to chat</div>
          )}
        </div>
      </div>

      {/* Add this CSS in your global style or a <style> tag for hover effect */}
      <style>{`
        .group:hover .group-hover-visible {
          opacity: 1 !important;
        }
        .group-hover-visible {
          transition: opacity 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Messages;
