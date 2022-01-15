import React from "react";
import { useResizeDetector } from "react-resize-detector";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Carousel component
//
let CarouselContainerStyled = styled.div`
  padding: 20px 50px 0px 50px;
  position: relative;
`;

const DefaultCard = styled.div`
  padding: 5px;
  display: inline-block;
  width: 150px;
  height: 150px;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px solid lightgray;
  border-radius: 10px;
  overflow: auto;
  white-space: normal;
`;
const Arrow = styled.button`
  background: lightblue;
  border: 1px solid lightgray;
  border-radius: 40%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const ArrowLeft = styled(Arrow)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;
const ArrowRight = styled(Arrow)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

let MovingContainerStyled = styled.div`
  display: inline-block;
  white-space: nowrap;
  transition: transform 0.4s linear;
  transform: translateX(${({ count }) => -count * 100}px);
`;

const defaultItems = [
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
];
export default function Carousel({ items = defaultItems }) {
  let [count, setCount] = React.useState(0);
  let [canScroll, setCanScroll] = React.useState({});
  let [isTransitionStarted, setIsTransitionStarted] = React.useState(false);
  let movingContainer = React.useRef();

  const onResize = React.useCallback(() => {
    canMovingContainerScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref: mainContainer } = useResizeDetector({ onResize });

  let canMovingContainerScroll = () => {
    let relativeLeft =
      movingContainer.current.getBoundingClientRect().left -
      mainContainer.current.getBoundingClientRect().left;
    let relativeRight =
      mainContainer.current.getBoundingClientRect().right -
      movingContainer.current.getBoundingClientRect().right;
    setCanScroll({ left: relativeLeft < 0, right: relativeRight < 0 });
  };

  React.useEffect(() => {
    canMovingContainerScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // We need to run this also when transition ends to get fresh coordinates
    movingContainer.current.addEventListener("transitionend", () => {
      canMovingContainerScroll();
      setIsTransitionStarted(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CarouselContainerStyled>
      <div
        ref={mainContainer}
        style={{
          overflow: "hidden",
        }}
      >
        <MovingContainerStyled count={count} ref={movingContainer}>
          {items.map((x) => {
            return (
              <DefaultCard key={x.id}>
                <h1>{x.title}</h1>
                <p>{x.body}</p>
              </DefaultCard>
            );
          })}
        </MovingContainerStyled>
      </div>
      <ArrowLeft
        disabled={!canScroll.left}
        onClick={() => {
          if (isTransitionStarted) return;
          setCount(count - 1);
          setIsTransitionStarted(true);
        }}
      >
        <ArrowLeftOutlined />
      </ArrowLeft>
      <ArrowRight
        disabled={!canScroll.right}
        onClick={() => {
          if (isTransitionStarted) return;
          setCount(count + 1);
          setIsTransitionStarted(true);
        }}
      >
        <ArrowRightOutlined />
      </ArrowRight>
    </CarouselContainerStyled>
  );
}
