import React from "react";
import "./index.css";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";

// Responsive dropdown menu

export default function DropDownMenu() {
  const isMobile = useMediaQuery({ query: "(max-width: 624px)" });
  let [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <div className="dropdownmenu">
      <nav
        // Makes sense to have mobile menu open only on mobile screen and when menu is in open state
        className={isMenuOpen && isMobile ? "open" : ""}
        role="navigation"
        style={{
          backgroundColor: "darkorange",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ul
          style={{
            flex: 1,
            minWidth: 0,
            // Menu items are hiddden only when we are on mobile and the menu is in closed state
            visibility: isMobile && !isMenuOpen ? "hidden" : "",
          }}
        >
          <li>
            <a href="/#">One</a>
          </li>
          <li>
            <a href="/#">Two</a>
            <ul>
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
                <ul>
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
        <div style={{ cursor: "pointer", marginRight: 5 }}>
          {isMobile &&
            (isMenuOpen ? (
              <AiOutlineClose
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              />
            ) : (
              <AiOutlineMenu
                onClick={() => {
                  setIsMenuOpen(true);
                }}
              />
            ))}
        </div>
      </nav>
    </div>
  );
}
