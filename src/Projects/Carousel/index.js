import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useResizeDetector } from "react-resize-detector";

export default function Carousel(props) {
  let [count, setCount] = React.useState(0);
  let [relativeCords, setRelativeCords] = React.useState({});
  let innerContainer = React.useRef();
  // We use this variable because during transition if user clicks multiple times the arrow buttons, coordinates are not computed correctly anymore
  let [transitionBlock, setTransitionBlock] = React.useState(false);

  let innerContainerRelativeCordsToParent = () => {
    let relativeLeft =
      innerContainer.current.getBoundingClientRect().left -
      ref.current.getBoundingClientRect().left;
    let relativeRight =
      ref.current.getBoundingClientRect().right -
      innerContainer.current.getBoundingClientRect().right;

    setRelativeCords({ relativeLeft, relativeRight });
  };

  const onResize = React.useCallback(() => {
    // When main container is resized we want to update relative coordinates
    innerContainerRelativeCordsToParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref } = useResizeDetector({ onResize });

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
      <div style={{ paddingLeft: 50, position: "relative", paddingRight: 50 }}>
        <h1>{props.title}</h1>
        <div
          ref={ref}
          style={{
            overflow: "hidden",
          }}
        >
          {/* If you have height issues with below div, see this: https://stackoverflow.com/questions/27536428/inline-block-element-height-issue */}
          <div
            ref={innerContainer}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              transition: "transform 0.4s linear",
              transform: `translateX(${-count * 100}px)`,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((x) => {
              return (
                <div
                  style={{
                    padding: 5,
                    display: "inline-block",
                    width: 150,
                    marginLeft: 5,
                    marginRight: 5,
                    border: "1px solid lightgray",
                    borderRadius: 10,
                  }}
                >
                  <h1>Item</h1>
                  <p>Some details</p>
                  <p>Some details</p>
                  <p>Some details</p>
                  <p>Some details</p>
                  <p>Some details</p>
                </div>
              );
            })}
          </div>
        </div>
        <button
          style={{
            background: "white",
            border: "1px solid lightgray",
            borderRadius: "20%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            width: 30,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          disabled={relativeCords.relativeLeft >= 0}
          onClick={() => {
            if (transitionBlock) return;
            setCount(count - 1);
            setTransitionBlock(true);
          }}
        >
          <AiOutlineArrowLeft />
        </button>
        <button
          style={{
            background: "white",
            border: "1px solid lightgray",
            borderRadius: "20%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            width: 30,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",

            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          disabled={relativeCords.relativeRight >= 0}
          onClick={() => {
            if (transitionBlock) return;
            setCount(count + 1);
            setTransitionBlock(true);
          }}
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
}
