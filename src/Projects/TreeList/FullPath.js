import React from "react";
import styled from "styled-components";

let PathContainerStyled = styled.div`
  padding: 5px;
  font-size: 13px;
`;

let PathItemStyled = styled.span`
  cursor: pointer;
  color: blue;
`;

export default function FullPath(props) {
  let getFullPath = (node) => {
    if (node.parent) {
      return [...getFullPath(node.parent), node];
    }
    return [node];
  };
  return (
    <PathContainerStyled>
      {getFullPath(props.currentNode).map((x) => (
        <PathItemStyled
          key={x.id}
          onClick={() => {
            props.setCurrentNode(x);
          }}
        >{`${x.name || ""}/`}</PathItemStyled>
      ))}
    </PathContainerStyled>
  );
}
