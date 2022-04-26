import "./App.css";
import React from "react";
import Carousel from "./Projects/Carousel";
import CnnNextBtn from "./Projects/CnnNextBtn";
import StackOverflowAnimation from "./Projects/StackOverflowAnimation";
import Tree from "./Projects/Tree";
import TreeList from "./Projects/TreeList";
import Snake from "./Projects/Snake";
import Minesweeper from "./Projects/Minesweeper";
function App() {
  let [checkedNodes, setCheckedNodes] = React.useState([]);

  return (
    <div>
      <Tree
        isFilterable
        isCheckable
        checkedNodes={checkedNodes}
        onCheckChange={setCheckedNodes}
      />{" "}
    </div>
  );
}

export default App;
