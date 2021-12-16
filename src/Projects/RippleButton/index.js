import React from "react";
import "./index.css";

///
//
// Button with ripple effect
//

export default function RippleButton() {
  let [coords, setCoords] = React.useState();
  let btnRef = React.useRef();
  return (
    <div className="ripple-btn" style={{ marginLeft: 200, paddingTop: 50 }}>
      <button
        ref={btnRef}
        className="ripple"
        onClick={(e) => {
          const relativeToParentX =
            e.clientX - btnRef.current.getBoundingClientRect().left;
          const relativeToParentY =
            e.clientY - btnRef.current.getBoundingClientRect().top;
          setCoords({
            x: relativeToParentX,
            y: relativeToParentY,
            // dummy used for generating new key on each click, so that animation is re applied.
            dummy: ((coords?.dummy || 0) + 1) % 100,
          });
        }}
      >
        {coords && (
          <span
            key={coords.dummy}
            className="circle"
            style={{ top: coords.y, left: coords.x }}
          ></span>
        )}
        Ripple btn
      </button>
    </div>
  );
}
