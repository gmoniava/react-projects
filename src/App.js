import "./App.css";
import {
  CnnNextBtn,
  DropDownMenu,
  Carousel,
  // StackOverflowAnimation2,
  // StackOverflowAnimation,
  TreeList,
  Tree,
} from "./Projects";
import React from "react";

let tree = [
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
            children: [],
          },
        ],
      },
      {
        id: 32,
        name: "item 1.2",
        children: [],
      },
    ],
  },
  { name: "item2", id: 2, children: [] },
  { name: "item3", id: 3, children: [] },
  { name: "item4", id: 4, children: [] },
];
function App() {
  let [checked, setChecked] = React.useState([]);

  return (
    <div style={{}}>
      {" "}
      <Tree
        checkedNodes={checked}
        data={tree}
        checkable
        onCheckChange={setChecked}
      />{" "}
    </div>
  );
}

export default App;
