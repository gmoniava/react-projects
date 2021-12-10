import React from "react";
import "./index.css";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
///
//
// Responsive dropdown menu
//
export default function DropDownMenu() {
  const isMobile = useMediaQuery({ query: "(max-width: 624px)" });
  let [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // If someone moved to larger screen close the mobile menu
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="dropdownmenu">
      <nav
        className={isMenuOpen ? "open" : ""}
        role="navigation"
        style={{
          height: 50,
          position: "relative",
          backgroundColor: "darkorange",
        }}
      >
        <ul
          style={{
            position: "relative",
            top: isMobile ? 50 : 0,
            minWidth: 0,
            // If we are on mobile screen and the mobile menu is closed, menu items should be hidden
            display: isMobile && !isMenuOpen ? "none" : "",
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
                <a href="/#" style={{}}>
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
        {/* Toggle menu btn, shows up only on mobile */}
        <div
          style={{
            cursor: "pointer",
            position: "absolute",
            right: 5,
            marginRight: 5,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {isMobile &&
            (isMenuOpen ? (
              <CloseOutlined
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              />
            ) : (
              <MenuOutlined
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
