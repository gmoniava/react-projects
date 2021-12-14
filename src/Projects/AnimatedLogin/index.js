import React from "react";
import "./index.css";

///
//
// Animated login
//

let mainContainerHeight = 300;
let mainContainerWidth = 500;
let slidingPageOffset = 10;

export default function AnimatedLogin() {
  let [page, setPage] = React.useState(1);

  return (
    <div
      className="animated-login"
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      <div
        style={{
          width: mainContainerWidth,
          height: mainContainerHeight,
          backgroundColor: "#4d7fd1",
          position: "relative",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          display: "flex",
        }}
      >
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
        <div
          style={{
            height: mainContainerHeight + 2 * slidingPageOffset,
            position: "absolute",
            transition: "left 1s linear",
            left: page === 2 ? mainContainerWidth / 2 : 0,
            width: "50%",
            backgroundColor: "white",
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            top: -slidingPageOffset,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: page === 2 ? -mainContainerWidth / 2 : 0,
              transition: "left 1s linear",
              width: "calc(2*100%)",
              height: "100%",
              display: "flex",
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
    </div>
  );
}
