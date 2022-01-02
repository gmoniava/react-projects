import React from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
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
  padding-top: ${({ isMobile, isMenuOpen }) =>
    isMobile && isMenuOpen ? "50px" : "0"};

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

  ${({ isMenuOpen }) =>
    isMenuOpen
      ? `
          /* When menu is shown, we stack menu items vertically, and on full screen. */
          > ul {
            flex-direction: column;
            width: 100%;

            li {
             width: 100%;
            }
          }
          
        `
      : `
          /* 2nd level nested menu */
          ul li:hover > ul {
            display: block;
            position: absolute;
            left: 0;
            top: 100%;
          }        
        `}
`;

let ToggleBtnContainerStyled = styled.div`
  cursor: pointer;
  position: absolute;
  right: 5px;
  margin-right: 5px;
  top: 15px;
`;

let ToggleMenuBtn = ({ isMobile, isMenuOpen, setIsMenuOpen }) => {
  return (
    isMobile && (
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
    )
  );
};

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
      {(!isMobile || isMenuOpen) && (
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
                </a>
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
      )}
      <ToggleMenuBtn
        isMobile={isMobile}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />
    </MainContainerStyled>
  );
}
