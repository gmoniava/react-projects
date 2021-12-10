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

let defaultData = {
  name: "Root dir",
  children: [
    {
      name: "item1",
      icon: <FolderOutlined />,
      children: [
        {
          name: "item 1.1",
          icon: <FolderOutlined />,

          children: [
            {
              name: "item 1.1.1",
              children: [],
            },
            {
              name: "item 1.1.2",
              children: [],
            },
          ],
        },
        {
          name: "item 1.2",
          onClick: () => {
            console.log("Item 1.2");
          },
          children: [],
        },
      ],
    },
    { name: "item2", children: [], icon: <FileWordOutlined /> },
    { name: "item3", children: [], icon: <GoogleOutlined /> },

    { name: "item4", children: [] },
  ],
};

export default function TreeList({ data = defaultData, showPath }) {
  let [parents, setParents] = React.useState([]);
  let [currentNode, setCurrentNode] = React.useState(data);
  return (
    <div className="navigatetree" style={{ padding: 20 }}>
      <div
        style={{
          borderRadius: 10,
          padding: 20,
        }}
      >
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
            setParents(parents.slice(0, parents.length - 1));
          }}
        />
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
            {parents && [...parents, currentNode].map((x) => x.name).join("/")}
          </div>
        )}
        {currentNode.children.map((x) => {
          return (
            <div
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
                  setParents([...parents, currentNode]);
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
