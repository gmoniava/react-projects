import React from "react";
import { useResizeDetector } from "react-resize-detector";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

///
//
// Carousel component
//

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
  let innerContainer = React.useRef();

  // We use these coordinates to know if we should show left/right arrows or not
  let [relativeCords, setRelativeCords] = React.useState({});

  // We use this variable because during transition if user clicks multiple times the arrow buttons, coordinates are not computed correctly anymore
  let [transitionBlock, setTransitionBlock] = React.useState(false);

  let innerContainerRelativeCordsToParent = () => {
    let relativeLeft =
      innerContainer.current.getBoundingClientRect().left -
      mainContainer.current.getBoundingClientRect().left;
    let relativeRight =
      mainContainer.current.getBoundingClientRect().right -
      innerContainer.current.getBoundingClientRect().right;
    setRelativeCords({ relativeLeft, relativeRight });
  };

  const onResize = React.useCallback(() => {
    // When main container is resized we want to update relative coordinates
    innerContainerRelativeCordsToParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref: mainContainer } = useResizeDetector({ onResize });

  React.useEffect(() => {
    innerContainerRelativeCordsToParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // We need to run this also when transition ends to get fresh coordinates
    innerContainer.current.addEventListener("transitionend", () => {
      innerContainerRelativeCordsToParent();
      setTransitionBlock(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="carousel" style={{ padding: 50 }}>
      <div
        style={{
          paddingLeft: 50,
          position: "relative",
          paddingRight: 50,
        }}
      >
        <div
          ref={mainContainer}
          style={{
            overflow: "hidden",
          }}
        >
          <div
            ref={innerContainer}
            style={{
              display: "inline-block", // use inline-block so that width of this div is based on content
              whiteSpace: "nowrap",
              transition: "transform 0.4s linear",
              transform: `translateX(${-count * 100}px)`,
            }}
          >
            {items.map((x) => {
              return (
                <DefaultCard key={x.id}>
                  <h1>{x.title}</h1>
                  <p>{x.body}</p>
                </DefaultCard>
              );
            })}
          </div>
        </div>
        <ArrowLeft
          disabled={relativeCords.relativeLeft >= 0}
          onClick={() => {
            if (transitionBlock) return;
            setCount(count - 1);
            setTransitionBlock(true);
          }}
        >
          <ArrowLeftOutlined />
        </ArrowLeft>
        <ArrowRight
          disabled={relativeCords.relativeRight >= 0}
          onClick={() => {
            if (transitionBlock) return;
            setCount(count + 1);
            setTransitionBlock(true);
          }}
        >
          <ArrowRightOutlined />
        </ArrowRight>
      </div>
    </div>
  );
}
