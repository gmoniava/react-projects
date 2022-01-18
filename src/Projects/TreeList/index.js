import React from "react";
import styled from "styled-components";

import {
  ArrowLeftOutlined,
  FolderOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

///
//
// Allows you to navigate through tree hierarchy showing only one list at a time
//
// Props
//  initialData: data organized in tree like structure
//  style: you can pass the typical style object which will be applied to main container.
//

let defaultData = [
  {
    name: "item1",
    id: 1,
    children: [
      {
        name: "item 1.1",
        id: 33,
        children: [
          {
            id: 22,
            name: "item 1.1.1",
            children: [],
          },
          {
            id: 12,
            name: "item 1.1.2",
            children: [
              {
                id: 99,
                name: "item 1.1.2.1",
                children: [
                  {
                    id: 7761,
                    name: "item 1.1.2.1.1",
                  },
                ],
              },
              {
                id: 991,
                name: "item 1.1.2.2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 32,
        name: "item 1.2",
        icon: <GoogleOutlined />,
        children: [],
      },
      {
        id: 3132,
        name: "item 1.3",
        children: [],
      },
    ],
  },
  { name: "item 2", id: 2, children: [] },
  { name: "item 3", id: 3, children: [] },
  { name: "item 4", id: 4, children: [] },
];
let ContainerStyled = styled.div`
  padding: 20px;
`;

let PathContainerStyled = styled.div`
  padding: 5px;
  color: gray;
  font-size: 13px;
`;

let PathItemStyled = styled.span`
  cursor: pointer;
  color: blue;
`;

let ListItemStyled = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
`;

let TreeListHeaderStyled = styled.div`
  display: flex;
  align-items: center;
`;

export default function TreeList({
  initialData = defaultData,
  showPath = true,
  style,
}) {
  let [currentNode, setCurrentNode] = React.useState({
    id: "treelist-root-id-0001",
    children: initialData,
  });

  let getCurrentPath = (node) => {
    if (node.parent) {
      return [...getCurrentPath(node.parent), node];
    }
    return [node];
  };

  return (
    <ContainerStyled style={{ width: 300, ...style }}>
      <TreeListHeaderStyled>
        <ArrowLeftOutlined
          onClick={() => {
            if (currentNode.parent) setCurrentNode({ ...currentNode.parent });
          }}
          style={{
            cursor: "pointer",
            color: currentNode.parent ? "black" : "lightgray",
          }}
        />
        {showPath && (
          <PathContainerStyled>
            {getCurrentPath(currentNode).map((x) => (
              <PathItemStyled
                key={x.id}
                onClick={() => {
                  setCurrentNode(x);
                }}
              >{`${x.name || ""}/`}</PathItemStyled>
            ))}
          </PathContainerStyled>
        )}
      </TreeListHeaderStyled>

      {currentNode?.children.map((x) => {
        return (
          <ListItemStyled
            key={x.id}
            onClick={(e) => {
              if (x.children && x.children.length) {
                setCurrentNode({ parent: currentNode, ...x });
              }
              x.onClick && x.onClick(e);
            }}
          >
            {" "}
            <div style={{ marginRight: 5 }}>
              {" "}
              {!!x.children?.length
                ? x.icon || <FolderOutlined />
                : x.icon}{" "}
            </div>
            <div> {x.name} </div>
          </ListItemStyled>
        );
      })}
    </ContainerStyled>
  );
}
