import React from "react";
import { useMediaQuery } from "react-responsive";
import "./index.css";
///
//
// Responsive animated login
//

let slidingPageOffset = 10;

export default function AnimatedLogin({ width, height }) {
  let [page, setPage] = React.useState(1);
  const isMobile = useMediaQuery({ query: "(max-width: 624px)" });

  return (
    <div
      className="animated-login"
      style={{
        marginTop: slidingPageOffset,
        marginLeft: slidingPageOffset,
        width: width || "100%",
        height: height || "100%",
        backgroundColor: "#4d7fd1",
        position: "relative",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* First page preview */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            setPage(1);
          }}
        >
          Login
        </button>
      </div>
      {/* Second page preview */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            setPage(2);
          }}
        >
          Signup
        </button>
      </div>
      {/* Main sliding window */}
      <div
        style={{
          left:
            isMobile || page === 1
              ? -slidingPageOffset
              : `calc(50% + ${slidingPageOffset}px)`,
          top:
            !isMobile || page === 1
              ? -slidingPageOffset
              : `calc(50% + ${slidingPageOffset}px)`,
          width: isMobile ? `calc(100% + ${2 * slidingPageOffset}px)` : "50%",
          height: isMobile ? "50%" : `calc(100% + ${2 * slidingPageOffset}px)`,
          position: "absolute",
          transition: "left 1s linear, top 1s linear",
          backgroundColor: "white",
          overflow: "hidden",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        {/* Div which further slides inside the outer div */}
        <div
          style={{
            left: isMobile || page === 1 ? 0 : `-100%`,
            top: !isMobile || page === 1 ? 0 : `-100%`,
            width: isMobile ? "100%" : "200%",
            height: isMobile ? "200%" : "100%",
            position: "absolute",
            transition: "left 1s linear, top 1s linear",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div
            style={{
              padding: 20,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Username"
              style={{ width: "100%", marginTop: 10 }}
            />
            <input
              placeholder="Password"
              style={{ width: "100%", marginTop: 10 }}
            />
            <button style={{ marginTop: 10 }}>Login</button>
          </div>
          <div
            style={{
              flex: 1,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              placeholder="User name"
              style={{ width: "100%", marginTop: 10 }}
            />
            <input
              placeholder="Email"
              style={{ width: "100%", marginTop: 10 }}
            />
            <input
              placeholder="Password"
              style={{ width: "100%", marginTop: 10 }}
            />
            <input
              placeholder="Retype password"
              style={{ width: "100%", marginTop: 10 }}
            />
            <button style={{ marginTop: 10 }}>Register</button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
