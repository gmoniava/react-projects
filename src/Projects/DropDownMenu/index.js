import React from "react";
import "./index.css";

export default function App() {
  return (
    <div className="dropdownmenu">
      <nav role="navigation">
        <ul>
          <li>
            <a href="/#">One</a>
          </li>
          <li>
            <a href="/#">Two</a>
            <ul class="dropdown">
              <li>
                <a href="/#">Sub-1</a>
              </li>
              <li>
                <a
                  href="/#"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Sub-2 <span>&#8250; </span>
                </a>
                <ul class="dropdown">
                  <li>
                    <a href="/#">Sub-2-1</a>
                  </li>
                  <li>
                    <a href="/#">Sub-2-2</a>
                  </li>
                  <li>
                    <a href="/#">Sub-2-3</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/#">Sub-3</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/#">Three</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
