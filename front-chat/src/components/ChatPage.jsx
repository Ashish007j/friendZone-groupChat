import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { HiLogout } from "react-icons/hi";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [newMsgIds, setNewMsgIds] = useState(new Set());
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await getMessagess(roomId);
        setMessages(msgs);
      } catch (error) {}
    }
    if (connected) loadMessages();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      // ✅ FIX 1: Connect headers mein username bhejo
      client.connect({ username: currentUser }, () => {
        setStompClient(client);
        toast.success("Connected!");

        // ✅ FIX 2: Messages subscribe karte waqt username header bhejo
        client.subscribe(
          `/topic/room/${roomId}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            const id = Date.now() + Math.random();
            newMessage._id = id;
            setMessages((prev) => [...prev, newMessage]);
            setNewMsgIds((prev) => new Set([...prev, id]));
            setTimeout(() => {
              setNewMsgIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }, 600);
          },
          { username: currentUser } // ✅ username header
        );

        // ✅ FIX 3: Active users subscribe karte waqt bhi username header bhejo
        client.subscribe(
          `/topic/room/${roomId}/active-users`,
          (message) => {
            const data = JSON.parse(message.body);
            setActiveUsers(data.count);
          },
          { username: currentUser } // ✅ username header
        );
      });
    };
    if (connected) connectWebSocket();
  }, [roomId]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = { sender: currentUser, content: input, roomId };
      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  // ✅ FIX 4: Proper disconnect with callback
  function handleLogout() {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
      });
    } else {
      setConnected(false);
      setRoomId("");
      setCurrentUser("");
      navigate("/");
    }
  }

  const getAvatar = (name) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=0369a1&textColor=ffffff`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-root {
          min-height: 100vh;
          background: #f0f6ff;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .chat-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 10% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 90% 100%, rgba(99, 102, 241, 0.06) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── HEADER ── */
        .chat-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.12);
          box-shadow: 0 4px 24px rgba(59, 130, 246, 0.06);
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }
          50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.1); }
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1e3a5f;
        }

        .header-badge {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.3px;
        }

        .active-users-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
          font-family: 'Syne', sans-serif;
          transition: all 0.3s ease;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .header-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-sm {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid rgba(59, 130, 246, 0.2);
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(254, 242, 242, 0.8);
          color: #ef4444;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #fef2f2;
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
          transform: translateY(-1px);
        }

        /* ── CHAT AREA ── */
        .chat-main {
          position: relative;
          z-index: 1;
          flex: 1;
          margin: 0 auto;
          width: 100%;
          max-width: 780px;
          padding: 88px 24px 96px;
          overflow-y: auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chat-main::-webkit-scrollbar { width: 4px; }
        .chat-main::-webkit-scrollbar-track { background: transparent; }
        .chat-main::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 4px; }

        .date-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0 8px;
        }

        .date-divider span {
          font-size: 11px;
          font-weight: 600;
          color: rgba(100, 116, 139, 0.7);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .date-divider::before,
        .date-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(59, 130, 246, 0.1);
        }

        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin: 3px 0;
          animation: msgIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .msg-row.mine { flex-direction: row-reverse; }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .msg-bubble-wrap {
          display: flex;
          flex-direction: column;
          max-width: 58%;
          gap: 3px;
        }

        .msg-sender {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          padding: 0 12px;
          letter-spacing: 0.3px;
        }

        .msg-row.mine .msg-sender { text-align: right; color: #3b82f6; }

        .msg-bubble {
          padding: 11px 16px;
          border-radius: 18px;
          font-size: 14.5px;
          line-height: 1.5;
          position: relative;
          word-break: break-word;
        }

        .msg-row:not(.mine) .msg-bubble {
          background: #ffffff;
          color: #1e293b;
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(59,130,246,0.06);
        }

        .msg-row.mine .msg-bubble {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          border-bottom-right-radius: 5px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
        }

        .msg-time {
          font-size: 10px;
          color: rgba(100, 116, 139, 0.6);
          padding: 0 12px;
        }

        .msg-row.mine .msg-time { text-align: right; }

        /* ── INPUT BAR ── */
        .input-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 12px 24px 16px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(59, 130, 246, 0.1);
        }

        .input-inner {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid rgba(59, 130, 246, 0.18);
          border-radius: 20px;
          padding: 8px 8px 8px 20px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-inner:focus-within {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 4px 24px rgba(59, 130, 246, 0.14), 0 0 0 3px rgba(59,130,246,0.06);
        }

        .msg-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1e293b;
          padding: 4px 0;
        }

        .msg-input::placeholder { color: rgba(100, 116, 139, 0.5); }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .attach-btn {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6;
        }

        .attach-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: scale(1.05);
        }

        .send-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
        }

        .send-btn:hover {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
          transform: scale(1.05) translateY(-1px);
        }

        .send-btn:active { transform: scale(0.97); }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0.4;
          gap: 12px;
          padding: 60px 0;
        }

        .empty-icon { font-size: 48px; }

        .empty-text {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="chat-root">
        {/* Header */}
        <header className="chat-header">
          <div className="header-brand">
            <div className="header-dot" />
            <span className="header-title">Room Chat</span>
            <span className="header-badge">#{roomId}</span>

            {/* Active users badge */}
            <span className="active-users-badge">
              <span className="active-dot" />
              {activeUsers} online
            </span>
          </div>

          <div className="header-user">
            <img
              src={getAvatar(currentUser)}
              alt={currentUser}
              className="user-avatar-sm"
            />
            <span className="user-name">{currentUser}</span>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <HiLogout size={15} />
            Leave
          </button>
        </header>

        {/* Messages */}
        <main ref={chatBoxRef} className="chat-main">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p className="empty-text">NO MESSAGES YET · SAY HI!</p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="date-divider">
              <span>Today</span>
            </div>
          )}

          {messages.map((message, index) => {
            const isMe = message.sender === currentUser;
            return (
              <div key={index} className={`msg-row ${isMe ? "mine" : ""}`}>
                <img
                  src={getAvatar(message.sender)}
                  alt={message.sender}
                  className="msg-avatar"
                />
                <div className="msg-bubble-wrap">
                  {!isMe && (
                    <span className="msg-sender">{message.sender}</span>
                  )}
                  <div className="msg-bubble">{message.content}</div>
                  <span className="msg-time">{timeAgo(message.timeStamp)}</span>
                </div>
              </div>
            );
          })}
        </main>

        {/* Input */}
        <div className="input-bar">
          <div className="input-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              type="text"
              placeholder="Type a message..."
              className="msg-input"
            />
            <button className="icon-btn attach-btn">
              <MdAttachFile size={19} />
            </button>
            <button onClick={sendMessage} className="icon-btn send-btn">
              <MdSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;