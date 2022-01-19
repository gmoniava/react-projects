import React from "react";
import styled from "styled-components";
import { CloseCircleFilled, MenuOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

///
//
// Side menu
//

let NavBar = styled.nav`
  display: flex;
  align-items: center;
  background-color: lightblue;
  height: 50px;
`;
let SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ isMenuOpen }) => (isMenuOpen ? 200 : 0)}px;
  background: black;
  opacity: 0.9;
  transition: width 0.6s linear;
  overflow: hidden;

  ul {
    margin-top: 50px;
  }

  li {
    margin-bottom: 20px;
  }
  a {
    color: white;
    text-decoration: none;
  }
`;

let NavBarItemsContainer = styled.ul`
  display: flex;
  list-style: none;

  li {
    margin-right: 10px;
  }
  a {
    color: black;
    text-decoration: none;
  }
`;
export default function App() {
  let [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 624px)" });

  return (
    <div>
      <NavBar>
        <MenuOutlined
          onClick={() => {
            setIsMenuOpen(true);
          }}
          style={{ marginLeft: 10, cursor: "pointer" }}
        />
        {!isMobile && (
          <NavBarItemsContainer>
            <li>
              <a href="/#">Home</a>
            </li>
            <li>
              <a href="/#">Services</a>
            </li>
            <li>
              <a href="/#">About</a>
            </li>
          </NavBarItemsContainer>
        )}
      </NavBar>
      <SideBar isMenuOpen={isMenuOpen}>
        <CloseCircleFilled
          onClick={() => {
            setIsMenuOpen(false);
          }}
          style={{ color: "white", position: "absolute", right: 20, top: 20 }}
        />
        <ul>
          <li>
            <a href="/#">Home</a>
          </li>
          <li>
            <a href="/#">Services</a>
          </li>
          <li>
            <a href="/#">About</a>
          </li>
        </ul>
      </SideBar>

      <div
        style={{
          marginLeft: isMenuOpen ? 200 : 0,
          transition: "margin-left 0.6s linear",
        }}
      >
        Content
      </div>
    </div>
  );
}
