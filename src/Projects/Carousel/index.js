import React from "react";
import { useResizeDetector } from "react-resize-detector";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Carousel component
//
let CarouselMainContainerStyled = styled.div`
  padding: 5px 50px;
  position: relative;
`;

let FixedContainerStyled = styled.div`
  overflow: hidden;
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
  baclground-color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
  left: 5px;
`;
const ArrowRight = styled(Arrow)`
  right: 5px;
`;

let MovingContainerStyled = styled.div`
  display: inline-block;
  white-space: nowrap;
  transition: transform 0.4s linear;
  transform: translateX(${({ counter }) => -counter * 100}px);
`;

const defaultItems = [
  { id: 1, title: "product", body: "good sneakers" },
  { id: 2, title: "product", body: "This model is also good" },
  {
    id: 3,
    title: "product",
    body: "Lorem ipsum dolor sit amet   ",
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
  let [counter, setCounter] = React.useState(0);
  let [enableArrowBtns, setEnableArrowBtns] = React.useState({});
  let [isTransitionStarted, setIsTransitionStarted] = React.useState(false);
  let movingContainer = React.useRef();

  const onResize = React.useCallback(() => {
    shouldEnableArrowBtns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref: fixedContainer } = useResizeDetector({ onResize });

  let shouldEnableArrowBtns = () => {
    let relativeLeft =
      movingContainer.current.getBoundingClientRect().left -
      fixedContainer.current.getBoundingClientRect().left;
    let relativeRight =
      fixedContainer.current.getBoundingClientRect().right -
      movingContainer.current.getBoundingClientRect().right;
    setEnableArrowBtns({ left: relativeLeft < 0, right: relativeRight < 0 });
  };

  React.useEffect(() => {
    shouldEnableArrowBtns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    movingContainer.current.addEventListener("transitionend", () => {
      shouldEnableArrowBtns();
      setIsTransitionStarted(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CarouselMainContainerStyled>
      <FixedContainerStyled ref={fixedContainer}>
        <MovingContainerStyled counter={counter} ref={movingContainer}>
          {items.map((x) => {
            return (
              <DefaultCard key={x.id}>
                <h1>{x.title}</h1>
                <p>{x.body}</p>
              </DefaultCard>
            );
          })}
        </MovingContainerStyled>
      </FixedContainerStyled>
      <ArrowLeft
        disabled={!enableArrowBtns.left}
        onClick={() => {
          if (isTransitionStarted) return;
          setCounter(counter - 1);
          setIsTransitionStarted(true);
        }}
      >
        <ArrowLeftOutlined />
      </ArrowLeft>
      <ArrowRight
        disabled={!enableArrowBtns.right}
        onClick={() => {
          if (isTransitionStarted) return;
          setCounter(counter + 1);
          setIsTransitionStarted(true);
        }}
      >
        <ArrowRightOutlined />
      </ArrowRight>
    </CarouselMainContainerStyled>
  );
}
