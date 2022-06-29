import React from "react";
import "./index.css";
import city from "./city.png";
function FullScreenMenu() {
  let [open, setOpen] = React.useState(false);
  return (
    <div className="fullscreen-menu">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: 50,
          borderBottom: "1px solid lightgray",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{ cursor: "pointer", padding: 10 }}
          className="menuBtn"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {open && (
        <div className="menu" style={{ height: "100%" }}>
          <div
            className="closeBtn"
            style={{
              position: "absolute",
              background: "black",
              borderRadius: "50%",
              opacity: 0.5,
              color: "white",
              right: 32,
              top: 32,
              height: 32,
              width: 32,
            }}
            onClick={() => {
              setOpen(!open);
            }}
          ></div>

          <div style={{ display: "flex", height: "100%" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {["Home", "Services", "Clients", "About Us"].map((x, i) => {
                return (
                  <div
                    key={i}
                    className="fadein-item"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {x}
                  </div>
                );
              })}
            </div>
            <div style={{ flex: 1 }}>
              <img
                alt="img"
                src={city}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              ></img>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FullScreenMenu;
