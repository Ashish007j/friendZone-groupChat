import React, { useState, useEffect } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const JoinCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState("");

  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  function handleFormInputChange(event) {
    setDetail({ ...detail, [event.target.name]: event.target.value });
  }

  function validateForm() {
    if (!detail.userName.trim()) { toast.error("Enter your name"); return false; }
    if (!detail.roomId.trim()) { toast.error("Enter Room ID"); return false; }
    if (detail.roomId.length < 4) { toast.error("Room ID must be at least 4 characters"); return false; }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        setLoading(true);
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully!");
        setCurrentUser(detail.userName);
        localStorage.setItem("userName", detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) toast.error(error.response?.data || "Invalid Room ID");
        else toast.error("Error in joining room");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
       const response = await createRoomApi({ roomId: detail.roomId });
        toast.success("Room Created Successfully!");
        setCurrentUser(detail.userName);
        localStorage.setItem("userName", detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) toast.error("Room already exists!");
        else toast.error("Error in creating room");
      }
    }
  }

  function generateRoomId() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setDetail({ ...detail, roomId: id });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .join-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          background: #f0f6ff;
          position: relative;
          overflow: hidden;
        }

        .join-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 15% 15%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 85% 85%, rgba(14,165,233,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%);
          animation: bgPulse 8s ease-in-out infinite alternate;
        }

        @keyframes bgPulse {
          0%   { opacity: 0.8; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.04); }
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          animation: floatOrb linear infinite;
          pointer-events: none;
        }
        .orb-1 { width: 320px; height: 320px; background: rgba(59,130,246,0.18);  top: -100px; left: -100px; animation-duration: 20s; }
        .orb-2 { width: 240px; height: 240px; background: rgba(14,165,233,0.15);  bottom: -80px; right: -80px; animation-duration: 16s; animation-delay: -6s; }
        .orb-3 { width: 160px; height: 160px; background: rgba(99,102,241,0.10);  top: 40%; right: 8%; animation-duration: 24s; animation-delay: -10s; }

        @keyframes floatOrb {
          0%,100% { transform: translateY(0px)   rotate(0deg);   }
          33%      { transform: translateY(-28px) rotate(120deg); }
          66%      { transform: translateY(18px)  rotate(240deg); }
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(59,130,246,0.07) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        /* ── CARD ── */
        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          margin: 20px;
          padding: 48px 40px;
          border-radius: 28px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(59,130,246,0.14);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.9) inset,
            0 24px 64px rgba(59,130,246,0.12),
            0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(${mounted ? '0' : '40px'});
          opacity: ${mounted ? '1' : '0'};
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease;
        }

        /* ── ICON ── */
        .icon-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          animation: iconFloat 3.5s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%,100% { transform: translateY(0);   }
          50%      { transform: translateY(-8px); }
        }

        .icon-ring {
          position: relative;
          width: 88px; height: 88px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(14,165,233,0.12));
          border: 1.5px solid rgba(59,130,246,0.2);
          box-shadow: 0 0 28px rgba(59,130,246,0.18), 0 0 56px rgba(59,130,246,0.08);
        }

        .icon-ring::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          background: linear-gradient(135deg, rgba(59,130,246,0.55), rgba(14,165,233,0.35)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: rotateBorder 5s linear infinite;
        }

        @keyframes rotateBorder { to { transform: rotate(360deg); } }

        .icon-ring img { width: 50px; height: 50px; object-fit: contain; }

        /* ── TITLE ── */
        .title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 36px;
          background: linear-gradient(135deg, #1e3a5f 20%, #2563eb 60%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        /* ── INPUTS ── */
        .field-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #000000; /* CHANGED: black */
          margin-bottom: 8px;
          display: block;
        }

        .input-wrapper {
          margin-bottom: 20px;
          position: relative;
        }

        .input-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #3b82f6, #0ea5e9);
          transition: width 0.3s ease;
          width: 0;
        }

        .input-wrapper.is-focused::after { width: calc(100% - 4px); }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(59,130,246,0.15);
          border-radius: 14px;
          padding: 14px 18px;
          color: #1e3a5f;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(59,130,246,0.05);
        }

        .input-field::placeholder { color: rgba(100,116,139,0.4); }

        .input-field:focus {
          background: #fff;
          border-color: rgba(59,130,246,0.4);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1), 0 2px 8px rgba(59,130,246,0.08);
        }

        /* ── BUTTONS ── */
        .btn-row { display: flex; gap: 12px; margin-top: 8px; }

        .btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn:hover::after { opacity: 1; }
        .btn:active { transform: scale(0.97) !important; }

        .btn-join {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          box-shadow: 0 8px 22px rgba(59,130,246,0.35);
        }
        .btn-join:hover  { box-shadow: 0 12px 30px rgba(59,130,246,0.5); transform: translateY(-2px); }

        .btn-create {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: #fff;
          box-shadow: 0 8px 22px rgba(14,165,233,0.28);
        }
        .btn-create:hover { box-shadow: 0 12px 30px rgba(14,165,233,0.42); transform: translateY(-2px); }

        .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

        .btn-generate {
          width: 100%;
          margin-top: 12px;
          background: transparent;
          border: 1.5px solid rgba(59,130,246,0.18);
          color: rgba(37,99,235,0.6);
          padding: 12px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-generate:hover {
          background: rgba(59,130,246,0.06);
          border-color: rgba(59,130,246,0.35);
          color: #2563eb;
          transform: translateY(-1px);
        }

        /* Spinner */
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
          margin-right: 6px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .bottom-tag {
          text-align: center;
          margin-top: 28px;
          font-size: 11px;
          color: #000000; /* CHANGED: black */
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 2px;
        }

        /* Stagger */
        .card .icon-wrap               { opacity: 0; animation: fadeUp 0.6s 0.15s forwards; }
        .card .title                   { opacity: 0; animation: fadeUp 0.6s 0.25s forwards; }
        .card .input-wrapper:nth-of-type(1) { opacity: 0; animation: fadeUp 0.6s 0.35s forwards; }
        .card .input-wrapper:nth-of-type(2) { opacity: 0; animation: fadeUp 0.6s 0.45s forwards; }
        .card .btn-row                 { opacity: 0; animation: fadeUp 0.6s 0.55s forwards; }
        .card .btn-generate            { opacity: 0; animation: fadeUp 0.6s 0.65s forwards; }
        .card .bottom-tag              { opacity: 0; animation: fadeUp 0.6s 0.75s forwards; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="join-page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div className="card">
          <div className="icon-wrap">
            <div className="icon-ring">
              <img src={chatIcon} alt="chat" />
            </div>
          </div>

          <h1 className="title">FriendZone</h1>
          <h2 className="title">  </h2>

          <div className={`input-wrapper ${focused === "userName" ? "is-focused" : ""}`}>
            <label className="field-label">Your Name</label>
            <input
              type="text"
              name="userName"
              placeholder="Enter your name"
              value={detail.userName}
              onChange={handleFormInputChange}
              onFocus={() => setFocused("userName")}
              onBlur={() => setFocused("")}
              className="input-field"
            />
          </div>

          <div className={`input-wrapper ${focused === "roomId" ? "is-focused" : ""}`}>
            <label className="field-label">Room ID</label>
            <input
              type="text"
              name="roomId"
              placeholder="Enter or generate room ID"
              value={detail.roomId}
              onChange={handleFormInputChange}
              onFocus={() => setFocused("roomId")}
              onBlur={() => setFocused("")}
              className="input-field"
            />
          </div>

          <div className="btn-row">
            <button onClick={joinChat} disabled={loading} className="btn btn-join">
              {loading ? <><span className="spinner" />Joining...</> : "Join Room"}
            </button>
            <button onClick={createRoom} className="btn btn-create">
              Create Room
            </button>
          </div>

          <button onClick={generateRoomId} className="btn-generate">
            ⚡ Generate Room ID
          </button>

          <p className="bottom-tag">SECURE · PRIVATE · REAL-TIME</p>
        </div>
      </div>
    </>
  );
};

export default JoinCreateChat;