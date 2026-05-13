import React, { useState, useEffect, useRef } from "react";
import { adminChatMethods, getAllOwnersApi } from "../services/authService";
import { getUser } from "../utils/storage";
import { useUtils } from "../hook/useUtils";
import { Trash2, Send, Search, User } from "lucide-react";
import { toast } from "react-toastify";

const Messages = () => {
  const { getImgURL } = useUtils();
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);

  const admin = getUser();
  const adminId = admin?._id || admin?.id;

  // 1. Load Owner List
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await getAllOwnersApi();
        const list = res.owners || res.auths || res.data || [];
        setOwners(list);
        setFilteredOwners(list);
      } catch (err) {
        console.error("Error fetching owners:", err);
      }
    };
    fetchOwners();
  }, []);

  // 2. Filter owners based on search
  useEffect(() => {
    const filtered = owners.filter(
      (o) =>
        o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  // 3. Polling for new messages every 4 seconds
  useEffect(() => {
    let interval;
    if (selectedOwner) {
      fetchHistory();
      interval = setInterval(fetchHistory, 4000);
    }
    return () => clearInterval(interval);
  }, [selectedOwner]);

  const fetchHistory = async () => {
    if (!selectedOwner) return;
    try {
      const res = await adminChatMethods.getHistory(adminId, selectedOwner._id);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching chat history:", err);
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
      fetchHistory(); // Refresh messages immediately
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await adminChatMethods.deleteMessage(msgId);
      toast.success("Message deleted");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container-fluid p-0" style={{ height: "80vh" }}>
      <div className="row g-0 h-100 bg-white shadow-sm border rounded-3 overflow-hidden">
        {/* --- SIDEBAR: OWNER LIST --- */}
        <div className="col-md-4 col-lg-3 border-end d-flex flex-column h-100 bg-white">
          <div className="p-3 border-bottom bg-navy text-white">
            <h6 className="mb-0 fw-bold">Owner Support</h6>
            <small className="opacity-75">Logged in as Admin</small>
          </div>

          <div className="p-2 border-bottom bg-light">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 shadow-none"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {filteredOwners.length > 0 ? (
              filteredOwners.map((owner) => (
                <div
                  key={owner._id}
                  onClick={() => {
                    setSelectedOwner(owner);
                    setMessages([]);
                  }}
                  className={`p-3 border-bottom d-flex align-items-center transition-all cursor-pointer ${selectedOwner?._id === owner._id ? "bg-primary-subtle border-start border-4 border-primary" : "hover-bg-light"}`}>
                  <img
                    src={getImgURL(owner.profileImage)}
                    className="rounded-circle me-3 border"
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/45x45?text=Owner")
                    }
                  />
                  <div className="overflow-hidden">
                    <div className="fw-bold small text-navy text-truncate">
                      {owner.fullName}
                    </div>
                    <div className="text-muted small text-truncate">
                      {owner.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted small">
                No owners found.
              </div>
            )}
          </div>
        </div>

        {/* --- CHAT AREA --- */}
        <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-light">
          {selectedOwner ? (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between shadow-sm">
                <div className="d-flex align-items-center">
                  <img
                    src={getImgURL(selectedOwner.profileImage)}
                    className="rounded-circle me-3 border"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div className="fw-bold text-navy">
                      {selectedOwner.fullName}
                    </div>
                    <small className="text-success small">Property Owner</small>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div
                className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3"
                style={{
                  backgroundImage:
                    'url("https://www.transparenttextures.com/patterns/cubes.png")',
                  backgroundColor: "#f4f7f6",
                }}>
                {messages.length > 0 ? (
                  messages.map((m, i) => {
                    const mSenderId =
                      typeof m.senderId === "object"
                        ? m.senderId._id
                        : m.senderId;
                    const isMe = mSenderId === adminId;

                    return (
                      <div
                        key={i}
                        className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}>
                        <div className="d-flex align-items-center gap-2 message-group">
                          {/* Delete icon visible only to Admin on Admin's messages */}
                          {isMe && (
                            <button
                              onClick={() => handleDeleteMessage(m._id)}
                              className="btn btn-link p-0 text-danger opacity-0 delete-btn-hover"
                              title="Delete message">
                              <Trash2 size={14} />
                            </button>
                          )}

                          <div
                            className={`p-2 px-3 shadow-sm ${isMe ? "bg-navy text-white" : "bg-white border text-dark"}`}
                            style={{
                              maxWidth: "75%",
                              borderRadius: isMe
                                ? "15px 15px 0 15px"
                                : "15px 15px 15px 0",
                            }}>
                            <div className="small">{m.message}</div>
                          </div>
                        </div>
                        <small
                          className="text-muted mt-1"
                          style={{ fontSize: "10px" }}>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    );
                  })
                ) : (
                  <div className="m-auto text-center text-muted small">
                    No messages yet. Send a message to start support.
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-top">
                <form className="d-flex gap-2" onSubmit={handleSend}>
                  <input
                    className="form-control rounded-pill px-4 shadow-none border-light-subtle"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your reply to owner..."
                    style={{ backgroundColor: "#f8f9fa" }}
                    required
                  />
                  <button
                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                    type="submit"
                    style={{
                      backgroundColor: "#001f3f",
                      width: "45px",
                      height: "45px",
                      border: "none",
                    }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto text-center">
              <div className="bg-white p-5 rounded-circle shadow-sm mb-3 d-inline-block">
                <User size={50} className="text-muted" />
              </div>
              <h5 className="text-navy fw-bold">Owner Support Chat</h5>
              <p className="text-muted small">
                Select an owner from the left to manage communication.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bg-navy { background-color: #001f3f !important; }
        .text-navy { color: #001f3f !important; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .message-group:hover .delete-btn-hover { opacity: 1 !important; transition: 0.3s; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Messages;
