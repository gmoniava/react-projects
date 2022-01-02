import React from "react";
import "./index.css";

///
//
// Button with ripple effect
//

export default function RippleButton() {
  let [rippleCoords, setRippleCoords] = React.useState();
  let btnRef = React.useRef();
  let handleClick = (e) => {
    // We must determine where was clicked on the button (in local coordinates)
    const relativeToParentX =
      e.clientX - btnRef.current.getBoundingClientRect().left;
    const relativeToParentY =
      e.clientY - btnRef.current.getBoundingClientRect().top;

    setRippleCoords({
      x: relativeToParentX,
      y: relativeToParentY,
      // Needs a new key each time (mainly for animation).
      key: ((rippleCoords?.key || 0) + 1) % 100,
    });
  };

  return (
    <div className="ripple-btn" style={{ marginLeft: 200, paddingTop: 50 }}>
      <button ref={btnRef} className="ripple" onClick={handleClick}>
        {rippleCoords && (
          <span
            key={rippleCoords.key}
            className="circle"
            style={{ top: rippleCoords.y, left: rippleCoords.x }}
          ></span>
        )}
        Ripple btn
      </button>
    </div>
  );
}
