import React from "react";
import { MenuOutlined, CloseOutlined, RightOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

///
//
// Responsive dropdown menu
//
//

let MainContainerStyled = styled.nav`
  height: 50px;
  position: relative;
  background-color: darkorange;

  ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    background: darkorange;
    box-sizing: border-box;
    height: 50px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:hover {
    background-color: #f7dd7e;
  }

  li a {
    color: #fff;
    text-decoration: none;
    font-size: 20px;
  }

  li ul {
    display: none;
  }

  > ul {
    position: relative;
    top: ${({ isMobile }) => (isMobile ? "50px" : "0")};
    /* If we are on mobile and menu is closed, no need to show menu items */
    display: ${({ isMenuOpen, isMobile }) =>
      isMobile && !isMenuOpen ? "none" : ""};
  }

  ${({ isMenuOpen }) =>
    isMenuOpen
      ? `
          ul {
            flex-direction: column;
            width: 100%;
          }
          li {
            width: 100%;
          }
        `
      : `
          /* Nested menu styles */
          ul li:hover > ul {
            display: block;
            position: absolute;
            left: 0;
            top: 100%;
          }
          ul li ul li:hover > ul {
            display: block;
            position: absolute;
            left: 100%;
            top: 0;
          }
        `}
`;

let ToggleBtnContainerStyled = styled.div`
  cursor: pointer;
  position: absolute;
  right: 5px;
  margin-right: 5px;
  top: 50%;
  transform: translateY(-50%);
`;

export default function DropDownMenu() {
  const isMobile = useMediaQuery({ query: "(max-width: 624px)" });
  let [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Close the menu when we are no longer on mobile
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <MainContainerStyled isMenuOpen={isMenuOpen} isMobile={isMobile}>
      <ul>
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
              <a href="/#" style={{ position: "relative" }}>
                Sub-2{" "}
                <RightOutlined
                  style={{
                    fontSize: 10,
                    position: "absolute",
                    right: -20,
                    top: 5,
                  }}
                />
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
      {isMobile && (
        <ToggleBtnContainerStyled>
          {isMenuOpen ? (
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
          )}
        </ToggleBtnContainerStyled>
      )}
    </MainContainerStyled>
  );
}
