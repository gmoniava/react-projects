import React from "react";
import { useMediaQuery } from "react-responsive";
import menuIcon from "./menu.svg";
import "./index.css";

//
// Responsive navbar with dropdown
// Supports only one level of nesting
//

// Menu data
let menu = [
  { name: "Home", url: "http://www.google.com" },
  {
    name: "Services",
    url: "http://www.facebook.com",
    children: [
      { name: "Design", url: "http://www.linkedin.com" },
      { name: "Consultancy", url: "http://www.bing.com" },
    ],
  },
  { name: "Help", url: "http://www.google.com" },
  { name: "About", url: "http://www.google.com" },
];

let MenuItems = (props) => {
  return props.data?.map((x) => {
    if (x.children) {
      return (
        <div className="menu-item" key={x.name}>
          <div>{x.name}</div>
          {x.children.length && (
            <div className="submenu">
              <MenuItems data={x.children} />
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
            flexDirection: isMenuOpen ? "column" : "row",
            display: "flex",
          }}
        >
          {" "}
          <MenuItems data={menu} />
        </div>
      )}
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
