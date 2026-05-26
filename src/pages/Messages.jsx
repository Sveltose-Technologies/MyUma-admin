// // // import React, { useState, useEffect, useRef } from "react";
// // // import { adminChatMethods, getAllOwnersApi } from "../services/authService";
// // // import { getUser } from "../utils/storage";
// // // import { useUtils } from "../hook/useUtils";
// // // import { Trash2, Send, Search, User } from "lucide-react";
// // // import { toast } from "react-toastify";

// // // const Messages = () => {
// // //   const { getImgURL } = useUtils();
// // //   const [owners, setOwners] = useState([]);
// // //   const [filteredOwners, setFilteredOwners] = useState([]);
// // //   const [selectedOwner, setSelectedOwner] = useState(null);
// // //   const [messages, setMessages] = useState([]);
// // //   const [text, setText] = useState("");
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const scrollRef = useRef(null);

// // //   const admin = getUser();
// // //   const adminId = admin?._id || admin?.id;

// // //   // 1. Load Owner List
// // //   useEffect(() => {
// // //     const fetchOwners = async () => {
// // //       try {
// // //         const res = await getAllOwnersApi();
// // //         const list = res.owners || res.auths || res.data || [];
// // //         setOwners(list);
// // //         setFilteredOwners(list);
// // //       } catch (err) {
// // //         console.error("Error fetching owners:", err);
// // //       }
// // //     };
// // //     fetchOwners();
// // //   }, []);

// // //   // 2. Filter owners based on search
// // //   useEffect(() => {
// // //     const filtered = owners.filter(
// // //       (o) =>
// // //         o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         o.email?.toLowerCase().includes(searchTerm.toLowerCase()),
// // //     );
// // //     setFilteredOwners(filtered);
// // //   }, [searchTerm, owners]);

// // //   // 3. Polling for new messages every 4 seconds
// // //   useEffect(() => {
// // //     let interval;
// // //     if (selectedOwner) {
// // //       fetchHistory();
// // //       interval = setInterval(fetchHistory, 4000);
// // //     }
// // //     return () => clearInterval(interval);
// // //   }, [selectedOwner]);

// // //   const fetchHistory = async () => {
// // //     if (!selectedOwner) return;
// // //     try {
// // //       const res = await adminChatMethods.getHistory(adminId, selectedOwner._id);
// // //       setMessages(res.data || []);
// // //     } catch (err) {
// // //       console.error("Error fetching chat history:", err);
// // //     }
// // //   };

// // //   const handleSend = async (e) => {
// // //     e.preventDefault();
// // //     if (!text.trim() || !selectedOwner) return;

// // //     const payload = {
// // //       senderId: adminId,
// // //       receiverId: selectedOwner._id,
// // //       message: text,
// // //     };

// // //     try {
// // //       await adminChatMethods.send(payload);
// // //       setText("");
// // //       fetchHistory(); // Refresh messages immediately
// // //     } catch (err) {
// // //       toast.error("Failed to send message");
// // //     }
// // //   };

// // //   const handleDeleteMessage = async (msgId) => {
// // //     if (!window.confirm("Delete this message permanently?")) return;
// // //     try {
// // //       await adminChatMethods.deleteMessage(msgId);
// // //       toast.success("Message deleted");
// // //       fetchHistory();
// // //     } catch (err) {
// // //       toast.error("Failed to delete message");
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   return (
// // //     <div className="container-fluid p-0" style={{ height: "80vh" }}>
// // //       <div className="row g-0 h-100 bg-white shadow-sm border rounded-3 overflow-hidden">
// // //         {/* --- SIDEBAR: OWNER LIST --- */}
// // //         <div className="col-md-4 col-lg-3 border-end d-flex flex-column h-100 bg-white">
// // //           <div className="p-3 border-bottom bg-navy text-white">
// // //             <h6 className="mb-0 fw-bold">Owner Support</h6>
// // //             <small className="opacity-75">Logged in as Admin</small>
// // //           </div>

// // //           <div className="p-2 border-bottom bg-light">
// // //             <div className="input-group input-group-sm">
// // //               <span className="input-group-text bg-white border-end-0">
// // //                 <Search size={14} />
// // //               </span>
// // //               <input
// // //                 type="text"
// // //                 className="form-control border-start-0 ps-0 shadow-none"
// // //                 placeholder="Search owners..."
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //               />
// // //             </div>
// // //           </div>

// // //           <div className="flex-grow-1 overflow-auto">
// // //             {filteredOwners.length > 0 ? (
// // //               filteredOwners.map((owner) => (
// // //                 <div
// // //                   key={owner._id}
// // //                   onClick={() => {
// // //                     setSelectedOwner(owner);
// // //                     setMessages([]);
// // //                   }}
// // //                   className={`p-3 border-bottom d-flex align-items-center transition-all cursor-pointer ${selectedOwner?._id === owner._id ? "bg-primary-subtle border-start border-4 border-primary" : "hover-bg-light"}`}>
// // //                   <img
// // //                     src={getImgURL(owner.profileImage)}
// // //                     className="rounded-circle me-3 border"
// // //                     style={{
// // //                       width: "45px",
// // //                       height: "45px",
// // //                       objectFit: "cover",
// // //                     }}
// // //                     onError={(e) =>
// // //                       (e.target.src = "https://placehold.co/45x45?text=Owner")
// // //                     }
// // //                   />
// // //                   <div className="overflow-hidden">
// // //                     <div className="fw-bold small text-navy text-truncate">
// // //                       {owner.fullName}
// // //                     </div>
// // //                     <div className="text-muted small text-truncate">
// // //                       {owner.email}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))
// // //             ) : (
// // //               <div className="p-4 text-center text-muted small">
// // //                 No owners found.
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* --- CHAT AREA --- */}
// // //         <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-light">
// // //           {selectedOwner ? (
// // //             <>
// // //               {/* Chat Header */}
// // //               <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between shadow-sm">
// // //                 <div className="d-flex align-items-center">
// // //                   <img
// // //                     src={getImgURL(selectedOwner.profileImage)}
// // //                     className="rounded-circle me-3 border"
// // //                     style={{
// // //                       width: "40px",
// // //                       height: "40px",
// // //                       objectFit: "cover",
// // //                     }}
// // //                   />
// // //                   <div>
// // //                     <div className="fw-bold text-navy">
// // //                       {selectedOwner.fullName}
// // //                     </div>
// // //                     <small className="text-success small">Property Owner</small>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Message List */}
// // //               <div
// // //                 className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3"
// // //                 style={{
// // //                   backgroundImage:
// // //                     'url("https://www.transparenttextures.com/patterns/cubes.png")',
// // //                   backgroundColor: "#f4f7f6",
// // //                 }}>
// // //                 {messages.length > 0 ? (
// // //                   messages.map((m, i) => {
// // //                     const mSenderId =
// // //                       typeof m.senderId === "object"
// // //                         ? m.senderId._id
// // //                         : m.senderId;
// // //                     const isMe = mSenderId === adminId;

// // //                     return (
// // //                       <div
// // //                         key={i}
// // //                         className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}>
// // //                         <div className="d-flex align-items-center gap-2 message-group">
// // //                           {/* Delete icon visible only to Admin on Admin's messages */}
// // //                           {isMe && (
// // //                             <button
// // //                               onClick={() => handleDeleteMessage(m._id)}
// // //                               className="btn btn-link p-0 text-danger opacity-0 delete-btn-hover"
// // //                               title="Delete message">
// // //                               <Trash2 size={14} />
// // //                             </button>
// // //                           )}

// // //                           <div
// // //                             className={`p-2 px-3 shadow-sm ${isMe ? "bg-navy text-white" : "bg-white border text-dark"}`}
// // //                             style={{
// // //                               maxWidth: "75%",
// // //                               borderRadius: isMe
// // //                                 ? "15px 15px 0 15px"
// // //                                 : "15px 15px 15px 0",
// // //                             }}>
// // //                             <div className="small">{m.message}</div>
// // //                           </div>
// // //                         </div>
// // //                         <small
// // //                           className="text-muted mt-1"
// // //                           style={{ fontSize: "10px" }}>
// // //                           {new Date(m.createdAt).toLocaleTimeString([], {
// // //                             hour: "2-digit",
// // //                             minute: "2-digit",
// // //                           })}
// // //                         </small>
// // //                       </div>
// // //                     );
// // //                   })
// // //                 ) : (
// // //                   <div className="m-auto text-center text-muted small">
// // //                     No messages yet. Send a message to start support.
// // //                   </div>
// // //                 )}
// // //                 <div ref={scrollRef} />
// // //               </div>

// // //               {/* Chat Input */}
// // //               <div className="p-3 bg-white border-top">
// // //                 <form className="d-flex gap-2" onSubmit={handleSend}>
// // //                   <input
// // //                     className="form-control rounded-pill px-4 shadow-none border-light-subtle"
// // //                     value={text}
// // //                     onChange={(e) => setText(e.target.value)}
// // //                     placeholder="Type your reply to owner..."
// // //                     style={{ backgroundColor: "#f8f9fa" }}
// // //                     required
// // //                   />
// // //                   <button
// // //                     className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
// // //                     type="submit"
// // //                     style={{
// // //                       backgroundColor: "#001f3f",
// // //                       width: "45px",
// // //                       height: "45px",
// // //                       border: "none",
// // //                     }}>
// // //                     <Send size={18} />
// // //                   </button>
// // //                 </form>
// // //               </div>
// // //             </>
// // //           ) : (
// // //             <div className="m-auto text-center">
// // //               <div className="bg-white p-5 rounded-circle shadow-sm mb-3 d-inline-block">
// // //                 <User size={50} className="text-muted" />
// // //               </div>
// // //               <h5 className="text-navy fw-bold">Owner Support Chat</h5>
// // //               <p className="text-muted small">
// // //                 Select an owner from the left to manage communication.
// // //               </p>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <style>{`
// // //         .bg-navy { background-color: #001f3f !important; }
// // //         .text-navy { color: #001f3f !important; }
// // //         .hover-bg-light:hover { background-color: #f8f9fa; }
// // //         .message-group:hover .delete-btn-hover { opacity: 1 !important; transition: 0.3s; }
// // //         .cursor-pointer { cursor: pointer; }
// // //         .transition-all { transition: all 0.2s ease-in-out; }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default Messages;

// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   getAllOwnersAPI,
// //   getChatByAdminOwnerAPI,
// //   sendMessageAPI,
// //   deleteChatAPI,

// // } from "../services/authService";
// // import { getUser } from "../utils/storage";
// // import { useUtils } from "../hook/useUtils";
// // import { toast } from "react-toastify";
// // import {
// //   Send,
// //   CheckCheck,
// //   Search,
// //   Trash2,
// //   User,
// //   ShieldCheck,
// //   MessageCircle,
// // } from "lucide-react";

// // const Messages = () => {
// //   const { getImgURL } = useUtils();
// //   const [contacts, setContacts] = useState([]); // Will hold Owners
// //   const [messages, setMessages] = useState([]);
// //   const [selectedOwner, setSelectedOwner] = useState(null);
// //   const [text, setText] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const scrollRef = useRef(null);
// //   const currentUser = getUser();
// //   const adminId = currentUser?.id || currentUser?._id;

// //   // Auto scroll to bottom
// //   useEffect(() => {
// //     if (scrollRef.current) {
// //       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
// //     }
// //   }, [messages]);

// //   // 1. Fetch Owners List (Admin Support View)
// //   const fetchOwners = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await getAllOwnersAPI();
// //       const list = res.auths || res.owners || res.data || [];
// //       setContacts(list);
// //     } catch (err) {
// //       toast.error("Failed to load owners");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOwners();
// //   }, []);

// //   // 2. Fetch Chat History (Polling)
// //   useEffect(() => {
// //     let interval;
// //     if (selectedOwner) {
// //       fetchChatHistory();
// //       interval = setInterval(fetchChatHistory, 5000);
// //     }
// //     return () => clearInterval(interval);
// //   }, [selectedOwner]);

// //   const fetchChatHistory = async () => {
// //     if (!selectedOwner) return;
// //     try {
// //       // API for Admin talking to Owner
// //       const res = await getChatByAdminOwnerAPI(adminId, selectedOwner._id);
// //       setMessages(res.data || []);
// //     } catch (err) {
// //       console.error("Chat Error", err);
// //     }
// //   };

// //   // 3. Send Message
// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!text.trim() || !selectedOwner) return;

// //     try {
// //       const payload = {
// //         senderId: adminId,
// //         receiverId: selectedOwner._id,
// //         listingId: null, // Admin to Owner support typically has no specific listingId
// //         message: text.trim(),
// //       };

// //       const res = await sendMessageAPI(payload);
// //       if (res) {
// //         setText("");
// //         fetchChatHistory();
// //       }
// //     } catch (err) {
// //       toast.error("Message not sent");
// //     }
// //   };

// //   // 4. Delete Message
// //   const handleDeleteMessage = async (msgId) => {
// //     if (!window.confirm("Delete this message?")) return;
// //     try {
// //       await deleteChatAPI(msgId);
// //       setMessages(messages.filter((m) => m._id !== msgId));
// //       toast.success("Deleted");
// //     } catch (err) {
// //       toast.error("Delete failed");
// //     }
// //   };

// //   const filteredContacts = contacts.filter((c) =>
// //     c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
// //   );

// //   if (loading && contacts.length === 0)
// //     return (
// //       <div className="vh-100 d-flex align-items-center justify-content-center">
// //         Loading Owner Support...
// //       </div>
// //     );

// //   return (
// //     <div className="container-fluid py-2" style={{ height: "90vh" }}>
// //       <div
// //         className="row g-0 h-100 shadow border rounded-4 overflow-hidden bg-white mx-auto"
// //         style={{ maxWidth: "1300px" }}>
// //         {/* --- SIDEBAR: OWNER LIST --- */}
// //         <div className="col-md-4 col-lg-3 d-flex flex-column border-end bg-white">
// //           <div className="p-3 bg-navy text-white d-flex align-items-center gap-3">
// //             <img
// //               src={getImgURL(currentUser?.profileImage)}
// //               className="rounded-circle border border-2 border-light"
// //               width="45"
// //               height="45"
// //               style={{ objectFit: "cover" }}
// //               alt="Admin"
// //             />
// //             <div className="overflow-hidden">
// //               <h6 className="mb-0 fw-bold text-truncate">Support Center</h6>
// //               <small className="opacity-75">Admin Dashboard</small>
// //             </div>
// //           </div>

// //           <div className="p-2 border-bottom shadow-sm">
// //             <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
// //               <Search size={16} className="text-muted" />
// //               <input
// //                 type="text"
// //                 className="form-control border-0 bg-transparent shadow-none small"
// //                 placeholder="Search Owners..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
// //           </div>

// //           <div className="flex-grow-1 overflow-auto custom-scroll">
// //             {filteredContacts.map((u) => (
// //               <div
// //                 key={u._id}
// //                 onClick={() => {
// //                   setSelectedOwner(u);
// //                   setMessages([]);
// //                 }}
// //                 className={`d-flex align-items-center p-3 border-bottom cursor-pointer hover-effect ${selectedOwner?._id === u._id ? "bg-primary-subtle border-start border-4 border-primary" : ""}`}>
// //                 <img
// //                   src={getImgURL(u.profileImage)}
// //                   className="rounded-circle me-3 border shadow-sm"
// //                   width="45"
// //                   height="45"
// //                   style={{ objectFit: "cover" }}
// //                   onError={(e) =>
// //                     (e.target.src =
// //                       "https://cdn-icons-png.flaticon.com/512/149/149071.png")
// //                   }
// //                   alt=""
// //                 />
// //                 <div className="flex-grow-1 overflow-hidden text-start">
// //                   <h6 className="mb-0 small fw-bold text-dark text-truncate">
// //                     {u.fullName}
// //                   </h6>
// //                   <small className="text-muted" style={{ fontSize: "10px" }}>
// //                     Business Owner
// //                   </small>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* --- CHAT WINDOW --- */}
// //         <div className="col-md-8 col-lg-9 d-flex flex-column h-100 bg-light">
// //           {selectedOwner ? (
// //             <>
// //               {/* Header */}
// //               <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between shadow-sm sticky-top">
// //                 <div className="d-flex align-items-center">
// //                   <img
// //                     src={getImgURL(selectedOwner.profileImage)}
// //                     className="rounded-circle border"
// //                     width="40"
// //                     height="40"
// //                     style={{ objectFit: "cover" }}
// //                     alt=""
// //                   />
// //                   <div className="ms-3 text-start">
// //                     <h6 className="mb-0 fw-bold text-navy">
// //                       {selectedOwner.fullName}
// //                     </h6>
// //                     <small
// //                       className="text-success fw-bold"
// //                       style={{ fontSize: "11px" }}>
// //                       online
// //                     </small>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Messages */}
// //               <div
// //                 ref={scrollRef}
// //                 className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 chat-bg">
// //                 {messages.map((msg, i) => {
// //                   const mSenderId = msg.senderId?._id || msg.senderId;
// //                   const isMe = mSenderId?.toString() === adminId?.toString();
// //                   return (
// //                     <div
// //                       key={i}
// //                       className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}>
// //                       <div
// //                         className={`p-2 px-3 rounded-3 shadow-sm ${isMe ? "bg-navy text-white msg-me" : "bg-white text-dark msg-other"}`}
// //                         style={{ maxWidth: "70%", fontSize: "14px" }}>
// //                         <div className="d-flex justify-content-between gap-3">
// //                           <span>{msg.message}</span>
// //                           <Trash2
// //                             size={12}
// //                             className="mt-1 cursor-pointer opacity-50 hover-opacity-100"
// //                             onClick={() => handleDeleteMessage(msg._id)}
// //                           />
// //                         </div>
// //                         <div
// //                           className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`}
// //                           style={{ fontSize: "9px" }}>
// //                           {new Date(msg.createdAt).toLocaleTimeString([], {
// //                             hour: "2-digit",
// //                             minute: "2-digit",
// //                           })}
// //                           {isMe && <CheckCheck size={14} className="ms-1" />}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               {/* Input */}
// //               <div className="p-3 bg-white border-top">
// //                 <form
// //                   className="d-flex gap-2 mx-auto col-lg-10"
// //                   onSubmit={handleSendMessage}>
// //                   <input
// //                     type="text"
// //                     className="form-control rounded-pill border-0 bg-light px-4 py-2 shadow-none"
// //                     placeholder="Type your response to owner..."
// //                     value={text}
// //                     onChange={(e) => setText(e.target.value)}
// //                   />
// //                   <button
// //                     type="submit"
// //                     className="btn btn-primary rounded-circle shadow p-0 d-flex align-items-center justify-content-center flex-shrink-0"
// //                     style={{
// //                       width: "45px",
// //                       height: "45px",
// //                       backgroundColor: "#001f3f",
// //                       border: "none",
// //                     }}>
// //                     <Send size={20} />
// //                   </button>
// //                 </form>
// //               </div>
// //             </>
// //           ) : (
// //             <div className="m-auto text-center px-4">
// //               <div className="bg-white p-5 rounded-circle shadow-sm mb-4 d-inline-block">
// //                 <MessageCircle size={80} className="text-primary opacity-20" />
// //               </div>
// //               <h4 className="fw-800 text-navy">Owner Support Messenger</h4>
// //               <p
// //                 className="text-muted small mx-auto"
// //                 style={{ maxWidth: "350px" }}>
// //                 Select a Business Owner from the list to assist them or manage
// //                 communications.
// //               </p>
// //               <div className="badge bg-primary-subtle text-primary px-3 py-2 mt-4 rounded-pill">
// //                 <ShieldCheck size={14} className="me-2" /> Admin Controlled Chat
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <style>{`
// //         .bg-navy { background-color: #001f3f; }
// //         .text-navy { color: #001f3f; }
// //         .fw-800 { font-weight: 800; }
// //         .chat-bg {
// //             background-color: #e5ddd5;
// //             background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
// //         }
// //         .msg-me { border-bottom-right-radius: 2px !important; }
// //         .msg-other { border-bottom-left-radius: 2px !important; }
// //         .hover-effect:hover { background-color: #f8f9fa; }
// //         .custom-scroll::-webkit-scrollbar { width: 5px; }
// //         .custom-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
// //         .hover-opacity-100:hover { opacity: 1 !important; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Messages;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   getAllOwnersAPI,
//   getChatAdminOwnerHistoryAPI, // Updated to match your authService
//   sendMessageAPI,
//   deleteChatMessageAPI, // Using the correct delete function name

// } from "../services/authService";
// import { getUser } from "../utils/storage";
// import {useUtils} from "../hook/useUtils";
// import { toast } from "react-toastify";
// import {
//   Send,
//   CheckCheck,
//   Search,
//   Trash2,
//   ShieldCheck,
//   MessageCircle,
//   Settings,
// } from "lucide-react";

// const Messages = () => {
//   const {getImgURL} = useUtils();
//   const [contacts, setContacts] = useState([]); // List of Owners
//   const [messages, setMessages] = useState([]);
//   const [selectedOwner, setSelectedOwner] = useState(null);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const scrollRef = useRef(null);
//   const currentUser = getUser();
//   const adminId = currentUser?.id || currentUser?._id;

//   // Auto scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // 1. Fetch Owners List
//   const fetchOwners = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllOwnersAPI();
//       const list = res.auths || res.owners || [];
//       setContacts(list);
//     } catch (err) {
//       toast.error("Failed to load owners");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOwners();
//   }, []);

//   // 2. Fetch Chat History (Polling)
//   useEffect(() => {
//     let interval;
//     if (selectedOwner) {
//       fetchChatHistory();
//       interval = setInterval(fetchChatHistory, 5000);
//     }
//     return () => clearInterval(interval);
//   }, [selectedOwner]);

//   const fetchChatHistory = async () => {
//     if (!selectedOwner) return;
//     try {
//       // Correct API for Admin <-> Owner
//       const res = await getChatAdminOwnerHistoryAPI(adminId, selectedOwner._id);
//       setMessages(res.data || []);
//     } catch (err) {
//       console.error("Chat Fetch Error", err);
//     }
//   };

//   // 3. Send Message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() || !selectedOwner) return;

//     try {
//       const payload = {
//         senderId: adminId,
//         receiverId: selectedOwner._id,
//         // Using a dummy/default listingId because your backend requires it
//         listingId: "69df6e21ae9f05e47b8dc874",
//         message: text.trim(),
//       };

//       const res = await sendMessageAPI(payload);
//       if (res) {
//         setText("");
//         fetchChatHistory();
//       }
//     } catch (err) {
//       toast.error("Message not sent. Check if listingId is valid.");
//     }
//   };

//   // 4. Delete Message
//   const handleDeleteMessage = async (msgId) => {
//     if (!window.confirm("Delete this message?")) return;
//     try {
//       await deleteChatMessageAPI(msgId);
//       setMessages((prev) => prev.filter((m) => m._id !== msgId));
//       toast.success("Message deleted");
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   const filteredContacts = contacts.filter((c) =>
//     c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="container-fluid py-2" style={{ height: "92vh" }}>
//       <div
//         className="row g-0 h-100 shadow border rounded-4 overflow-hidden bg-white mx-auto"
//         style={{ maxWidth: "1350px" }}>
//         {/* --- SIDEBAR: OWNER LIST --- */}
//         <div className="col-md-4 col-lg-3 d-flex flex-column border-end bg-white">
//           {/* Admin Profile Header */}
//           <div
//             className="p-3 bg-navy text-white d-flex align-items-center justify-content-between"
//             style={{ height: "75px" }}>
//             <div className="d-flex align-items-center gap-2 overflow-hidden">
//               <img
//                 src={getImgURL(currentUser?.profileImage)}
//                 className="rounded-circle border border-2 border-light shadow-sm"
//                 width="45"
//                 height="45"
//                 style={{ objectFit: "cover" }}
//                 alt="Admin"
//               />
//               <div className="overflow-hidden">
//                 <h6 className="mb-0 small fw-bold text-truncate">
//                   {currentUser?.fullName}
//                 </h6>
//                 <small
//                   className="opacity-75 text-uppercase"
//                   style={{ fontSize: "9px" }}>
//                   Administrator
//                 </small>
//               </div>
//             </div>
//             <Settings size={18} className="opacity-50 cursor-pointer" />
//           </div>

//           {/* Search */}
//           <div className="p-2 border-bottom shadow-sm">
//             <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
//               <Search size={16} className="text-muted" />
//               <input
//                 type="text"
//                 className="form-control border-0 bg-transparent shadow-none small"
//                 placeholder="Search owners..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Contacts List */}
//           <div className="flex-grow-1 overflow-auto custom-scroll">
//             {filteredContacts.map((u) => (
//               <div
//                 key={u._id}
//                 onClick={() => {
//                   setSelectedOwner(u);
//                   setMessages([]);
//                 }}
//                 className={`d-flex align-items-center p-3 border-bottom cursor-pointer hover-effect ${selectedOwner?._id === u._id ? "bg-light border-start border-4 border-primary" : ""}`}>
//                 <img
//                   src={getImgURL(u.profileImage)}
//                   className="rounded-circle me-3 border shadow-sm"
//                   width="48"
//                   height="48"
//                   style={{ objectFit: "cover" }}
//                   onError={(e) =>
//                     (e.target.src =
//                       "https://cdn-icons-png.flaticon.com/512/149/149071.png")
//                   }
//                   alt=""
//                 />
//                 <div className="flex-grow-1 overflow-hidden">
//                   <h6 className="mb-0 small fw-bold text-dark text-truncate">
//                     {u.fullName}
//                   </h6>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <small className="text-muted" style={{ fontSize: "10px" }}>
//                       Business Owner
//                     </small>
//                     <span
//                       className="badge bg-success rounded-circle"
//                       style={{ width: "8px", height: "8px", padding: 0 }}>
//                       {" "}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* --- CHAT WINDOW --- */}
//         <div
//           className="col-md-8 col-lg-9 d-flex flex-column h-100"
//           style={{ backgroundColor: "#e5ddd5" }}>
//           {selectedOwner ? (
//             <>
//               {/* Header: Selected Owner Profile */}
//               <div
//                 className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between shadow-sm sticky-top"
//                 style={{ height: "70px" }}>
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={getImgURL(selectedOwner.profileImage)}
//                     className="rounded-circle border shadow-sm"
//                     width="42"
//                     height="42"
//                     style={{ objectFit: "cover" }}
//                     alt=""
//                   />
//                   <div className="ms-3 text-start">
//                     <h6 className="mb-0 fw-bold text-navy">
//                       {selectedOwner.fullName}
//                     </h6>
//                     <small
//                       className="text-success fw-bold"
//                       style={{ fontSize: "11px" }}>
//                       online support active
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {/* Message Area */}
//               <div
//                 ref={scrollRef}
//                 className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 chat-bg-pattern">
//                 {messages.map((msg, i) => {
//                   // Logic to check if sender is Admin
//                   const mSenderId = msg.senderId?._id || msg.senderId;
//                   const isMe = mSenderId?.toString() === adminId?.toString();

//                   return (
//                     <div
//                       key={i}
//                       className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}>
//                       <div
//                         className={`p-2 px-3 rounded-3 shadow-sm position-relative ${isMe ? "bg-navy text-white msg-me" : "bg-white text-dark msg-other"}`}
//                         style={{ maxWidth: "70%", fontSize: "14.5px" }}>
//                         <div className="d-flex justify-content-between gap-3">
//                           <span style={{ wordBreak: "break-word" }}>
//                             {msg.message}
//                           </span>
//                           <Trash2
//                             size={13}
//                             className="mt-1 cursor-pointer opacity-50 hover-opacity-100"
//                             onClick={() => handleDeleteMessage(msg._id)}
//                           />
//                         </div>
//                         <div
//                           className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`}
//                           style={{ fontSize: "9px" }}>
//                           {new Date(msg.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                           {isMe && <CheckCheck size={14} className="ms-1" />}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Input Area */}
//               <div className="p-3 bg-white border-top">
//                 <form
//                   className="d-flex gap-2 mx-auto col-lg-10"
//                   onSubmit={handleSendMessage}>
//                   <input
//                     type="text"
//                     className="form-control rounded-pill border-0 bg-light px-4 py-2 shadow-none"
//                     placeholder="Type a response to the owner..."
//                     style={{ height: "45px" }}
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                   />
//                   <button
//                     type="submit"
//                     className="btn btn-navy rounded-circle shadow p-0 d-flex align-items-center justify-content-center"
//                     style={{ width: "45px", height: "45px", flexShrink: 0 }}
//                  >
//                     <Send size={20} className="text-white" />
//                   </button>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="m-auto text-center px-4">
//               <div className="bg-white p-5 rounded-circle shadow-sm mb-4 d-inline-block">
//                 <MessageCircle size={80} className="text-navy opacity-20" />
//               </div>
//               <h4 className="fw-bold text-navy">Admin Support Panel</h4>
//               <p
//                 className="text-muted small mx-auto"
//                 style={{ maxWidth: "350px" }}>
//                 Select a Business Owner from the sidebar to manage their support
//                 requests and inquiries.
//               </p>
//               <div className="badge bg-primary-subtle text-primary px-3 py-2 mt-4 rounded-pill">
//                 <ShieldCheck size={14} className="me-2" /> Authorized Admin
//                 Access
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         .bg-navy { background-color: #001f3f; }
//         .btn-navy { background-color: #001f3f; }
//         .text-navy { color: #001f3f; }
//         .chat-bg-pattern {
//             background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
//             background-size: contain;
//         }
//         .msg-me { border-bottom-right-radius: 2px !important; }
//         .msg-other { border-bottom-left-radius: 2px !important; }
//         .hover-effect:hover { background-color: #f8f9fa; transition: 0.2s; }
//         .cursor-pointer { cursor: pointer; }
//         .hover-opacity-100:hover { opacity: 1 !important; }
//         .custom-scroll::-webkit-scrollbar { width: 5px; }
//         .custom-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default Messages;

import React, { useState, useEffect, useRef } from "react";
import {
  getAllOwnersAPI,
  getChatAdminOwnerHistoryAPI,
  sendMessageAPI,
  deleteChatMessageAPI,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { useUtils } from "../hook/useUtils";
import { toast } from "react-toastify";
import {
  Send,
  CheckCheck,
  Search,
  Trash2,
  ShieldCheck,
  MessageCircle,

} from "lucide-react";

const Messages = () => {
  const { getImgURL } = useUtils();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const scrollRef = useRef(null);
  const currentUser = getUser();
  const adminId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await getAllOwnersAPI();
      const list = res.auths || res.owners || [];
      setContacts(list);
    } catch (err) {
      toast.error("Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedOwner) {
      fetchChatHistory();
      interval = setInterval(fetchChatHistory, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedOwner]);

  const fetchChatHistory = async () => {
    if (!selectedOwner) return;
    try {
      const res = await getChatAdminOwnerHistoryAPI(adminId, selectedOwner._id);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Chat Fetch Error", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedOwner) return;

    try {
      const payload = {
        senderId: adminId,
        receiverId: selectedOwner._id,
        listingId: "69df6e21ae9f05e47b8dc874", // Placeholder listing ID
        message: text.trim() || " ", // Đảm bảo không gửi chuỗi rỗng hoàn toàn
      };

      const res = await sendMessageAPI(payload);
      if (res) {
        setText("");
        fetchChatHistory();
      }
    } catch (err) {
      toast.error("Message not sent.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteChatMessageAPI(msgId);
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="container-fluid py-0"
      style={{
        height: "100vh",
        position: "relative",
        zIndex: 10,
        background: "#fff",
      }}>
      <div className="row g-0 h-100 overflow-hidden bg-white shadow-sm">
        {/* --- SIDEBAR --- */}
        <div
          className="col-md-4 col-lg-3 d-flex flex-column border-end bg-white"
          style={{ zIndex: 20 }}>
          <div
            className="p-3 bg-navy text-white d-flex align-items-center justify-content-between"
            style={{ height: "70px" }}>
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <img
                src={getImgURL(currentUser?.profileImage)}
                className="rounded-circle border border-2 border-light"
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
                alt="Admin"
              />
              <div className="overflow-hidden">
                <h6 className="mb-0 small fw-bold text-truncate">
                  {currentUser?.fullName || "Admin"}
                </h6>
                <small className="opacity-75" style={{ fontSize: "9px" }}>
                  SUPPORT PANEL
                </small>
              </div>
            </div>
          </div>

          <div className="p-2 border-bottom">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none small"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto custom-scroll">
            {filteredContacts.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedOwner(u);
                  setMessages([]);
                }}
                className={`d-flex align-items-center p-3 border-bottom cursor-pointer hover-effect ${selectedOwner?._id === u._id ? "bg-light border-start border-4 border-primary" : ""}`}>
                <img
                  src={getImgURL(u.profileImage)}
                  className="rounded-circle me-3 border"
                  width="45"
                  height="45"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0 small fw-bold text-dark">{u.fullName}</h6>
                  <small className="text-muted" style={{ fontSize: "10px" }}>
                    Owner
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CHAT SECTION --- */}
        <div
          className="col-md-8 col-lg-9 d-flex flex-column h-100"
          style={{ backgroundColor: "#e5ddd5" }}>
          {selectedOwner ? (
            <>
              <div
                className="p-3 bg-white border-bottom d-flex align-items-center shadow-sm"
                style={{ height: "70px", zIndex: 30 }}>
                <img
                  src={getImgURL(selectedOwner.profileImage)}
                  className="rounded-circle border"
                  width="45"
                  height="45"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
                <div className="ms-3">
                  <h6 className="mb-0 fw-bold text-dark">
                    {selectedOwner.fullName}
                  </h6>
                  {/* <small
                    className="text-success fw-bold"
                    style={{ fontSize: "11px" }}>
                    online support active
                  </small> */}
                </div>
              </div>

              {/* Chat Body */}
              <div
                ref={scrollRef}
                className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 chat-bg-pattern">
                {messages.map((msg, i) => {
                  const mSenderId = msg.senderId?._id || msg.senderId;
                  const isMe = mSenderId?.toString() === adminId?.toString();
                  return (
                    <div
                      key={i}
                      className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                      <div
                        className={`p-2 px-3 rounded-3 shadow-sm position-relative ${isMe ? "bg-navy text-white" : "bg-white text-dark"}`}
                        style={{ maxWidth: "70%", minWidth: "80px" }}>
                        <div className="d-flex justify-content-between gap-3">
                          <span style={{ fontSize: "14px" }}>
                            {msg.message}
                          </span>
                          <Trash2
                            size={13}
                            className="mt-1 cursor-pointer opacity-50 text-danger"
                            onClick={() => handleDeleteMessage(msg._id)}
                          />
                        </div>
                        <div
                          className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`}
                          style={{ fontSize: "9px" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isMe && <CheckCheck size={14} className="ms-1" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-white border-top">
                <form
                  className="d-flex gap-2 mx-auto col-lg-10"
                  onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="form-control rounded-pill border-1 bg-light px-4 shadow-none"
                    placeholder="Write your message..."
                    style={{ height: "45px" }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-navy rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      flexShrink: 0,
                      opacity: 1,
                      backgroundColor: "#001f3f",
                    }}>
                    <Send size={20} className="text-white" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto text-center">
              <MessageCircle size={80} className="text-navy opacity-20 mb-3" />
              <h4 className="text-navy fw-bold">Support Center</h4>
              <p className="text-muted small">
                Select an owner to start support chat.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bg-navy { background-color: #001f3f !important; }
        .text-navy { color: #001f3f; }
        .btn-navy { background-color: #001f3f !important; border: none !important; }
        .btn-navy:hover { background-color: #001f3f !important; opacity: 1 !important; }
        .chat-bg-pattern {
            background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
            background-size: contain;
        }
        .hover-effect:hover { background-color: #f8f9fa; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Messages;