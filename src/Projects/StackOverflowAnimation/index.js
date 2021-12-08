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
      <div style={{ fontSize: 22, position: "relative" }}>
        Hello{" "}
        {names.map((x, i) => {
          return (
            <React.Fragment key={i}>
              <span
                className={"active"}
                style={{
                  color: "orange",
                  fontWeight: "bold",
                  display: i === index ? "inline" : "none",
                }}
              >
                {x}
              </span>
              {/* Because the above span element is absolutely positioned, we use 
              this fake element to let the text width appear correctly. */}
              <span
                style={{
                  display: i === index ? "inline" : "none",
                  visibility: "hidden",
                  margin: "0 5px 0 5px",
                }}
              >
                {x}
              </span>
            </React.Fragment>
          );
        })}
        welcome here
      </div>
    </div>
  );
}
