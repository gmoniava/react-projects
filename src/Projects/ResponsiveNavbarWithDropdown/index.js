import React from "react";
import { useMediaQuery } from "react-responsive";
import menuIcon from "./menu.svg";
import "./index.css";

//
// Responsive navbar with dropdown
//

// Menu data
let menu = [
  { name: "Home", url: "http://www.google.com" },
  {
    name: "Services",
    url: "http://www.facebook.com",
    children: [
      {
        name: "Design",
        url: "http://www.linkedin.com",
      },
      { name: "Consultancy", url: "http://www.bing.com" },
    ],
  },
  { name: "Help", url: "http://www.google.com" },
  { name: "About", url: "http://www.google.com" },
];

let MenuItems = (props) => {
  return props.data?.map((x) => {
    // We draw children only if we aren't already in a submenu, because
    // we don't support deeply nested submenus
    if (x.children && !props.isInsideSubMenu) {
      return (
        <div className="menu-item" key={x.name}>
          <div>{x.name}</div>
          {x.children.length && (
            <div className="submenu">
              <MenuItems data={x.children} isInsideSubMenu />
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="menu-item" key={x.name}>
        <a href={x.url} style={{ color: "black", textDecoration: "none" }}>
          {x.name}
        </a>
      </div>
    );
  });
};

function App() {
  const isMobile = useMediaQuery({ query: "(max-width: 524px)" });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobile]);
  return (
    <div
      className="resp-navbar-dropdown"
      style={{
        backgroundColor: "orange",
        display: "flex",
        minHeight: 60,
      }}
    >
      {(!isMobile || isMenuOpen) && (
        <div
          style={{
            flex: 1,
            // On mobile the menu items are shown vertically
            flexDirection: isMenuOpen ? "column" : "row",
            display: "flex",
          }}
        >
          {" "}
          <MenuItems data={menu} />
        </div>
      )}
      {/* We show the menu button only on mobile */}
      {isMobile && (
        <img
          src={menuIcon}
          alt="menu"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            cursor: "pointer",
            padding: 20,
          }}
        ></img>
      )}
    </div>
  );
}

export default App;
