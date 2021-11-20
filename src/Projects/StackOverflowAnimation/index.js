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
    <div className="stackoverflowanimation">
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
              <span className={"active"}>{x} </span>
              {/* Because the above span element is absolutely positioned, we use 
              this fake element to make the parent span compute width correctly. */}
              <span
                style={{
                  visibility: "hidden",
                }}
              >
                {x}{" "}
              </span>
            </span>
          );
        })}
        welcome here
      </div>
    </div>
  );
}
