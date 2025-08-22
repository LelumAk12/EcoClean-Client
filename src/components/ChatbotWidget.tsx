import { useState, useEffect } from "react";

// Use Vite and CRA compatibility for env variable
const CHATBOT_URL = import.meta.env.VITE_REACT_APP_CHATBOT_URL || import.meta.env.REACT_APP_CHATBOT_URL;

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 600
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chatButtonStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#007bff",
    color: "#fff",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    cursor: "pointer",
    zIndex: 1000,
  };

  const chatWindowStyle: React.CSSProperties = {
    position: "fixed",
    bottom: isMobile ? 0 : 90,
    right: isMobile ? 0 : 24,
    width: isMobile ? "100vw" : 350,
    height: isMobile ? "100vh" : 500,
    background: "#fff",
    borderRadius: isMobile ? 0 : 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1001,
    overflow: "hidden",
    transition: "all 0.3s",
  };

  const headerStyle: React.CSSProperties = {
    background: "#007bff",
    color: "#fff",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: 16,
    borderBottom: "1px solid #e5e7eb",
    minHeight: 44,
  };

  const closeBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    marginLeft: 8,
    padding: 2,
    lineHeight: 1,
    borderRadius: 4,
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iframeStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    width: "100%",
    height: "100%",
  };

  if (!CHATBOT_URL) return null;

  return (
    <>
      {!open && (
        <button
          style={chatButtonStyle}
          aria-label="Open Chatbot"
          onClick={() => setOpen(true)}
        >
          {/* SVG chat icon for maximum compatibility */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="none" />
            <path d="M5 19V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7l-4 4 2-4z" fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="9" cy="12" r="1" fill="#007bff" />
            <circle cx="12" cy="12" r="1" fill="#007bff" />
            <circle cx="15" cy="12" r="1" fill="#007bff" />
          </svg>
        </button>
      )}
      {open && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>
            <span>Chatbot</span>
            <button
              style={closeBtnStyle}
              aria-label="Close Chatbot"
              onClick={() => setOpen(false)}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <iframe
            src={CHATBOT_URL}
            title="Chatbot"
            style={iframeStyle}
            allow="clipboard-write; clipboard-read"
          />
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
