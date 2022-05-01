import React from "react";
import styled from "styled-components";
import FullPath from "./FullPath";
import {
  ArrowLeftOutlined as BackIcon,
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
let MainContainer = styled.div`
  padding: 20px;
`;

let Node = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
`;

let TreeListHeader = styled.div`
  display: flex;
  align-items: center;
`;

export default function TreeList({
  initialData = defaultData,
  showPath = true,
  style,
}) {
  let [currentNode, setCurrentNode] = React.useState({
    id: "treelist-root-id-001",
    children: initialData,
  });

  let goBack = () => {
    if (currentNode.parent) setCurrentNode({ ...currentNode.parent });
  };

  let nodeClick = (node, e) => {
    if (node.children && node.children.length) {
      setCurrentNode({ parent: currentNode, ...node });
    }
    node.onClick && node.onClick(e);
  };
  return (
    <MainContainer style={{ width: 300, ...style }}>
      {/* The header of the component  */}
      <TreeListHeader>
        <BackIcon
          onClick={goBack}
          style={{
            cursor: "pointer",
            color: currentNode.parent ? "black" : "lightgray",
          }}
        />
        {/* Show the path where the user is */}
        {showPath && (
          <FullPath currentNode={currentNode} setCurrentNode={setCurrentNode} />
        )}
      </TreeListHeader>

      {/* Contents */}
      {currentNode?.children.map((node) => {
        return (
          <Node
            key={node.id}
            onClick={(e) => {
              nodeClick(node, e);
            }}
          >
            <div style={{ marginRight: 5 }}>
              {!!node.children?.length
                ? node.icon || <FolderOutlined />
                : node.icon}{" "}
            </div>
            <div> {node.name} </div>
          </Node>
        );
      })}
    </MainContainer>
  );
}
