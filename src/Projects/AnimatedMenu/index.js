import React from "react";
import styled from "styled-components";
import {
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";

///
//
// Animated menu
//

let MenuContainer = styled.ul`
  position: relative;
  height: 50px;
  width: 400px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  list-style: none;
`;

let Indicator = styled.span`
  height: 40px;
  width: 40px;
  background-color: #2fe12f;
  position: absolute;
  border-radius: 50%;
  top: -30px;
  border: 5px solid #2c2b2b;
  transition: left 0.3s linear;
  left: ${({ activeIndex }) => activeIndex * 50 + 40}px;
`;

let Item = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 50px;
  align-items: center;
  justify-content: center;

  .text {
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    transition: 0.4s linear;
    transform: translateY(${({ isActive }) => (isActive ? 0 : 10)}px);
  }

  > span {
    position: relative;
    top: 10px;
    z-index: 100;
    transition: transform 0.5s linear;
    transform: translateY(${({ isActive }) => (isActive ? -30 : 0)}px);
  }
`;

export default function App() {
  let [activeIndex, setActiveIndex] = React.useState();
  let menuItems = [
    { name: "Home", icon: <HomeOutlined /> },
    { name: "User", icon: <UserOutlined /> },
    { name: "Message", icon: <MessageOutlined /> },
    { name: "Settings", icon: <SettingOutlined /> },
  ];

  return (
    <div style={{ padding: 20, background: "#2c2b2b" }}>
      <MenuContainer>
        {menuItems.map((x, i) => {
          return (
            <Item
              key={i}
              isActive={activeIndex === i}
              onClick={() => {
                setActiveIndex(i);
              }}
            >
              {x.icon}
              <div className="text">{x.name}</div>
            </Item>
          );
        })}
        {activeIndex !== undefined && <Indicator activeIndex={activeIndex} />}
      </MenuContainer>
    </div>
  );
}
