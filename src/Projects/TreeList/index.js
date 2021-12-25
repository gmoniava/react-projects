import React from "react";

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
//

let defaultData = [
  {
    name: "item1",
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

export default function TreeList({
  initialData = defaultData,
  showPath = true,
  style,
}) {
  let [parents, setParents] = React.useState([]);
  let [currentNode, setCurrentNode] = React.useState({
    children: initialData,
    id: 0,
  });

  let fullPath = [...parents, currentNode];
  return (
    <div className="listtree" style={{ padding: 20, ...style }}>
      <div
        style={{
          borderRadius: 10,
          padding: 20,
        }}
      >
        {/* Go back button */}
        <ArrowLeftOutlined
          style={{
            cursor: "pointer",
            marginBottom: 5,
            border: "1px solid lightgray",
            borderRadius: "50%",
            padding: 5,
            color: parents.length === 0 ? "lightgray" : "black",
          }}
          onClick={() => {
            if (parents.length === 0) return;
            setCurrentNode(parents[parents.length - 1]);
            let copy = [...parents];
            copy.pop();
            setParents(copy);
          }}
        />
        {/* To show the parents */}
        {showPath && (
          <div
            style={{
              padding: 5,
              color: "gray",
              fontSize: 12,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {parents &&
              fullPath.map((x) => (
                <span
                  key={x.id}
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => {
                    let clickedNodeIndex = fullPath.findIndex(
                      (y) => y.id === x.id
                    );
                    setParents(fullPath.slice(0, clickedNodeIndex));
                    setCurrentNode(x);
                  }}
                >{`${x.name || ""}  /`}</span>
              ))}
          </div>
        )}
        {currentNode.children.map((x) => {
          return (
            <div
              key={x.id}
              style={{
                padding: 10,
                cursor: "pointer",
                fontSize: 20,
                border: "1px solid lightgray",
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => {
                if (x.children && x.children.length) {
                  setParents(fullPath);
                  setCurrentNode(x);
                }
                x.onClick && x.onClick(e);
              }}
            >
              {" "}
              <div style={{ marginRight: 5 }}> {x.icon} </div>
              <div> {x.name} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
