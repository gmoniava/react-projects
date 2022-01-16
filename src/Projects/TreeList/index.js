import React from "react";
import styled from "styled-components";

import {
  ArrowLeftOutlined,
  FolderOutlined,
  FileWordOutlined,
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
    name: "item1 test nodeA",
    icon: <FolderOutlined />,
    id: 1,
    children: [
      {
        name: "item 1.1",
        icon: <FolderOutlined />,
        id: 2,

        children: [
          {
            name: "item 1.1.1",
            icon: <FolderOutlined />,
            children: [
              {
                name: "item 1.1.1.1",
                children: [],

                id: 21,
              },
            ],
            id: 3,
          },
          {
            name: "item 1.1.2",
            children: [],
            id: 4,
          },
        ],
      },
      {
        name: "item 1.2",
        id: 5,

        onClick: () => {
          console.log("Item 1.2");
        },
        children: [],
      },
    ],
  },
  { name: "item2", id: 6, children: [], icon: <FileWordOutlined /> },
  { name: "item3", id: 7, children: [], icon: <GoogleOutlined /> },

  { name: "item4", id: 8, children: [] },
];

let ContainerStyled = styled.div`
  padding: 20px;
`;

let PathContainerStyled = styled.div`
  padding: 5px;
  color: gray;
  font-size: 12px;
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

export default function TreeList({
  initialData = defaultData,
  showPath = true,
  style,
}) {
  let [currentPath, setCurrentPath] = React.useState([
    { id: 0, children: initialData },
  ]);
  return (
    <ContainerStyled style={{ width: 300, ...style }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowLeftOutlined
          onClick={() => {
            if (currentPath.length === 1) return;
            let pathCopy = [...currentPath];
            pathCopy.pop();
            setCurrentPath(pathCopy);
          }}
          style={{
            cursor: "pointer",
            color: currentPath.length === 1 ? "lightgray" : "black",
          }}
        />
        {showPath && (
          <PathContainerStyled>
            {currentPath.map((x, i) => (
              <PathItemStyled
                key={x.id}
                onClick={() => {
                  setCurrentPath(currentPath.slice(0, i + 1));
                }}
              >{`${x.name || ""}  /`}</PathItemStyled>
            ))}
          </PathContainerStyled>
        )}
      </div>

      {/* The last item in the path, is the folder where we currently are */}
      {currentPath[currentPath.length - 1]?.children.map((x) => {
        return (
          <ListItemStyled
            key={x.id}
            style={{}}
            onClick={(e) => {
              if (x.children && x.children.length) {
                setCurrentPath([...currentPath, x]);
              }
              x.onClick && x.onClick(e);
            }}
          >
            {" "}
            <div style={{ marginRight: 5 }}> {x.icon} </div>
            <div> {x.name} </div>
          </ListItemStyled>
        );
      })}
    </ContainerStyled>
  );
}
