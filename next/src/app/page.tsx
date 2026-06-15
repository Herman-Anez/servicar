"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes bgReveal {
          0%   { background: #000000; }
          25%  { background: #0d0000; }
          60%  { background: #7a0000; }
          100% { background: #ff0000; }
        }

        @keyframes logoSlam {
          0%   { opacity: 0; transform: scale(5) translateY(-40px); filter: blur(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0);     filter: blur(0);    }
        }

        @keyframes glow {
          0%   { filter: brightness(1); }
          50%  { filter: brightness(1.6) drop-shadow(0 0 32px rgba(255,255,255,0.8)); }
          100% { filter: brightness(1); }
        }

        @keyframes flash {
          0%   { opacity: 0; }
          20%  { opacity: 0.55; }
          100% { opacity: 0; }
        }

        @keyframes btnRise {
          0%   { opacity: 0; transform: translateY(40px); }
          60%  { opacity: 1; transform: translateY(-4px); }
          80%  { transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .home-logo {
          animation:
            logoSlam 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both,
            glow     0.4s ease-out 1.1s both;
        }

        .home-flash {
          animation: flash 0.5s ease-out 1.1s both;
        }

        .home-btn {
          animation: btnRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both;
        }
      `}</style>

      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        fontFamily: "Inter, sans-serif",
        zIndex: 9999,
        animation: "bgReveal 1.4s ease-out both",
      }}>

        {/* Flash overlay */}
        <div className="home-flash" style={{
          position: "absolute",
          inset: 0,
          background: "white",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        <img
          src="/servicar-logo-blanco.svg"
          alt="SERVICAR"
          className="home-logo"
          style={{ width: 340, height: 133, position: "relative", zIndex: 2 }}
        />

        <Link
          href="/login"
          className="home-btn"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "14px 52px",
            borderRadius: 8,
            background: "white",
            color: "#cc0000",
            fontWeight: 800,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          Ingresar
        </Link>
      </div>
    </>
  );
}
