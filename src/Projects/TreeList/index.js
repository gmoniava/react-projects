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
  let [currentPath, setCurrentPath] = React.useState([
    { id: 0, children: initialData },
  ]);
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
            color: currentPath.length - 1 === 0 ? "lightgray" : "black",
          }}
          onClick={() => {
            if (currentPath.length - 1 === 0) return;
            let copy = [...currentPath];
            copy.pop();
            setCurrentPath(copy);
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
            {currentPath.map((x) => (
              <span
                key={x.id}
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  let clickedNodeIndex = currentPath.findIndex(
                    (y) => y.id === x.id
                  );
                  setCurrentPath(currentPath.slice(0, clickedNodeIndex + 1));
                }}
              >{`${x.name || ""}  /`}</span>
            ))}
          </div>
        )}
        {currentPath[currentPath.length - 1].children.map((x) => {
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
                  setCurrentPath([...currentPath, x]);
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
