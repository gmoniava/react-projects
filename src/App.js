import "./App.css";
import {
  CnnNextBtn,
  DropDownMenu,
  Carousel,
  StackOverflowAnimation,
  TreeList,
  Tree,
} from "./Projects";
import React from "react";

function App() {
  let [checked, setChecked] = React.useState([]);
  return (
    <div style={{}}>
      {" "}
      <Tree
        checkedNodes={checked}
        filterable
        checkable
        onCheckChange={setChecked}
      />{" "}
    </div>
  );
}

export default App;
