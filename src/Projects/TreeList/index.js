import React from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineFolder,
  AiOutlineFileWord,
  AiOutlineGoogle,
} from "react-icons/ai";

// Allows you to navigate through tree hierarchy showing only one list at a time

let data = {
  name: "root",
  children: [
    {
      name: "item1",
      icon: <AiOutlineFolder />,
      children: [
        {
          name: "item 1.1",
          icon: <AiOutlineFolder />,

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
    { name: "item2", children: [], icon: <AiOutlineFileWord /> },
    { name: "item3", children: [], icon: <AiOutlineGoogle /> },

    { name: "item4", children: [] },
  ],
};

export default function TreeList() {
  let [parents, setParents] = React.useState([]);
  let [currentDir, setCurrentDir] = React.useState(data);
  return (
    <div className="navigatetree" style={{ padding: 20 }}>
      <div
        style={{
          width: 500,
          borderRadius: 10,
          padding: 20,
        }}
      >
        <AiOutlineArrowLeft
          style={{
            cursor: "pointer",
            color: parents.length === 0 ? "lightgray" : "black",
          }}
          onClick={() => {
            if (parents.length === 0) return;
            setCurrentDir(parents[parents.length - 1]);
            setParents(parents.slice(0, parents.length - 1));
          }}
        />
        {currentDir.children.map((x) => {
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
                  setParents([...parents, currentDir]);
                  setCurrentDir(x);
                }
                x.onClick && x.onClick(e);
              }}
            >
              {" "}
              {x.icon}
              {x.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
