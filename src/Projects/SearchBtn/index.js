import React from "react";
import "./index.css";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

///
//
// Animated search button
//
// Props
//  value: textfield value
//  onChange: handler called when text value changes
//

export default function SearchBtn(props) {
  let [expanded, setExpanded] = React.useState(false);

  if (props.value === undefined || props.onChange === undefined) {
    console.warn("This component should be used in controlled mode");
  }

  return (
    <div className="expanding-searchbar" style={{ padding: 5 }}>
      <div
        className="main-container"
        style={{
          height: 64,
          width: expanded ? props.width || 256 : 64,
          borderRadius: 30,
          transition: "width 0.3s linear",
          backgroundColor: "#2985e8",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Search icon */}
        <div
          className="search-icon"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <SearchOutlined />
        </div>
        {/* Div for the input */}
        {expanded && (
          <div
            className="input"
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <input
              style={{
                color: "white",
                border: "none",
                background: "#2985e8",
                height: 30,
                width: "100%",
              }}
              value={props.value}
              placeholder="Type text"
              onChange={(e) => props.onChange && props.onChange(e.target.value)}
            />
          </div>
        )}
        {/* Close icon */}
        {expanded && (
          <div
            className="close"
            onClick={() => {
              props.onChange && props.onChange("");
            }}
          >
            <CloseOutlined />
          </div>
        )}
      </div>
    </div>
  );
}
