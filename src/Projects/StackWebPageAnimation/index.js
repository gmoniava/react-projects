import React from "react";
import "./index.css";

// Imitates animation from stackoverflow web page.

let names = ["John", "Alec baldwin", "Some long name"];

export default function App() {
  let [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      setIndex((ps) => (ps + 1) % 3);
    }, 2000);
  }, []);

  return (
    <div>
      <div className="parent" style={{ marginTop: 20, fontSize: 22 }}>
        Hello{" "}
        {names.map((x, i) => {
          return (
            <span
              style={{
                color: "orange",
                fontWeight: "bold",
                display: i === index ? "inline" : "none",
              }}
            >
              {/* This is the span which appears */}
              <span className={i === index ? "active" : ""}>
                {names[index]}{" "}
              </span>
              {/* This other span is to cause width changes */}
              <span
                style={{
                  visibility: "hidden",
                }}
              >
                {names[index]}{" "}
              </span>
            </span>
          );
        })}
        welcome here
      </div>
    </div>
  );
}
