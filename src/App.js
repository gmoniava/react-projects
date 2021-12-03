import "./App.css";
import {
  // DropDownMenu,
  // CnnNextBtn,
  // StackOverflowAnimation2,
  // StackOverflowAnimation,
  Carousel,
} from "./Projects";

function App() {
  return (
    <div style={{}}>
      {" "}
      <Carousel
        items={[
          { id: 1, title: "product", body: "good sneakers" },
          { id: 2, title: "product", body: "This model is also good" },
          {
            id: 3,
            title: "product",
            body: "Lorem ipsum dolor sit amet, consectetur",
          },
          {
            id: 4,
            title: "product",
            body: "Lorem ipsum dolor sit amet, consectetur",
          },
          {
            id: 5,
            title: "product",
            body: "Lorem ipsum dolor sit amet, consectetur",
          },
          {
            id: 6,
            title: "product",
            body: "Lorem ipsum dolor sit amet, consectetur",
          },
        ]}
      />{" "}
    </div>
  );
}

export default App;
