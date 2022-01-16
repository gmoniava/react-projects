import "./App.css";
import React from "react";
import SearchBtn from "./Projects/SearchBtn";
import Carousel from "./Projects/Carousel";
import CnnNextBtn from "./Projects/CnnNextBtn";
import RippleButton from "./Projects/RippleButton";
import StackOverflowAnimation from "./Projects/StackOverflowAnimation";
import Tree from "./Projects/Tree";
function App() {
  let [checkedNodes, setCheckedNodes] = React.useState([]);
  return (
    <div>
      {" "}
      <Tree
        isCheckable
        isFilterable
        checkedNodes={checkedNodes}
        onCheckChange={setCheckedNodes}
      />{" "}
    </div>
  );
}

export default App;
