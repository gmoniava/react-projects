import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Immitates next article arrow from CNN web site
//

let MainContainerStyled = styled.div`
  position: fixed;
  right: 0px;
  /*
     This width will increase on hover, hence appearing effect.
     And due to right:0, it will appear as div comes from right to left when width is changed. 
   */
  width: 20px;
  transition: width 0.7s linear;
  height: 100px;
  cursor: pointer;
  border: 1px solid lightgray;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
  &:hover {
    width: 220px;
  }
`;
let LeftArrowContainerStyled = styled.div`
  background: lightgray;
  height: 100%;
  width: 20px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0px;
`;
let HiddenContentStyled = styled.div`
  position: absolute;
  right: 20px;
  height: 100%;
  width: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;
export default function App() {
  return (
    <MainContainerStyled>
      <LeftArrowContainerStyled>
        <ArrowLeftOutlined />
      </LeftArrowContainerStyled>
      <HiddenContentStyled>
        <img
          alt=""
          style={{ height: 50, width: 50, objectFit: "cover" }}
          src="https://st2.depositphotos.com/7036298/10694/i/600/depositphotos_106948346-stock-photo-ripe-red-apple-with-green.jpg"
        />
        This is next article
      </HiddenContentStyled>{" "}
    </MainContainerStyled>
  );
}
