import React from "react";
import "./index.css";

// Imitates animation from stackoverflow web page.
// Uses transform for animations unlike the other project.

let names = ["Nick", "David", "Some long name"];

export default function App() {
  let [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      setIndex((ps) => (ps + 1) % 3);
    }, 2000);
  }, []);

  return (
    <div className="stackoverflowanimation2">
      <div
        style={{
          display: "flex",
          fontSize: 22,
        }}
      >
        Hello
        {names.map((x, i) => {
          // We use transform for animation, it doesn't remove the element
          // from document flow, so the width is properly calculated for this element.
          return (
            <div
              className={"active"}
              style={{
                color: "orange",
                margin: "0 5px 0 5px",
                fontWeight: "bold",
                display: i === index ? "block" : "none",
              }}
            >
              {x}
            </div>
          );
        })}
        welcome here
      </div>
    </div>
  );
}
