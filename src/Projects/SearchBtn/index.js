import React from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Animated search button
//
// Props
//  value: textfield value
//  onChange: handler called when text value changes
//

let ContainerStyled = styled.div`
  height: 64px;
  width: ${(props) => (props.expanded ? props.width || 256 : 64)}px;
  border-radius: 30px;
  transition: width 0.3s linear;
  background-color: #2985e8;
  display: flex;
  align-items: center;

  input:focus {
    outline: none;
  }

  input::placeholder {
    color: white;
  }
`;

let SearchBtnStyled = styled(SearchOutlined)`
  cursor: pointer;
  font-size: 32px;
  margin-left: 15px;
  margin-right: 5px;
  color: white;
`;

let CloseBtnStyled = styled(CloseOutlined)`
  height: 16px;
  width: 30px;
  color: white;
  cursor: pointer;
  padding-left: 5px;
  padding-right: 5px;
`;

export default function SearchBtn(props) {
  let [expanded, setExpanded] = React.useState(false);

  if (props.value === undefined || props.onChange === undefined) {
    console.warn("This component should be used in controlled mode");
  }

  return (
    <ContainerStyled width={props.width} expanded={expanded}>
      <SearchBtnStyled
        onClick={() => {
          setExpanded(!expanded);
        }}
      />
      {expanded && (
        <input
          style={{
            color: "white",
            flex: 1,
            border: "none",
            background: "#2985e8",
            height: 30,
            width: "100%",
          }}
          value={props.value}
          placeholder="Type text"
          onChange={(e) => props.onChange && props.onChange(e.target.value)}
        />
      )}
      {expanded && (
        <CloseBtnStyled
          onClick={() => {
            props.onChange && props.onChange("");
          }}
        />
      )}
    </ContainerStyled>
  );
}
