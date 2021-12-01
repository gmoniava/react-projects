import React from "react";
import "./index.css";
import { AiOutlineArrowRight } from "react-icons/ai";

// Immitates next article arrow from CNN web site

export default function App() {
  return (
    <div className="cnnnextbtn">
      <div
        style={{
          position: "fixed",
          right: 0,
          width: 20,
          transition: "width 0.7s linear",
          height: 100,
          cursor: "pointer",
          border: "1px solid lightgray",
          top: "50%",
          transform: "translateY(-50%)",
          overflow: "hidden",
        }}
        className="next-btn"
      >
        {/* This div is for the arrow */}
        <div
          style={{
            background: "lightgray",
            height: 100,
            width: 20,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            right: 0,
          }}
        >
          <AiOutlineArrowRight style={{}} />
        </div>
        {/* This div is for hidden content */}
        <div
          style={{
            position: "absolute",
            right: 20,
            height: "100%",
            width: 200,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            alt=""
            style={{ height: 50, width: 50, objectFit: "cover" }}
            src="https://st2.depositphotos.com/7036298/10694/i/600/depositphotos_106948346-stock-photo-ripe-red-apple-with-green.jpg"
          />
          This is next article
        </div>
      </div>
    </div>
  );
}
