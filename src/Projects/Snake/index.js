import React from "react";

// Classic snake game

export default function Snake() {
  let [snake, setSnake] = React.useState([
    { x: 250, y: 100 },
    { x: 200, y: 100 },
    { x: 150, y: 100 },
    { x: 100, y: 100 },
  ]);
  let directionRef = React.useRef();
  let gameOverRef = React.useRef(false);
  let ateFood = React.useRef(false);
  let [food, setFood] = React.useState();

  React.useEffect(() => {
    document.addEventListener("keydown", function (e) {
      let directions = {
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
      };

      if (
        (directionRef.current === "Left" &&
          directions[e.keyCode] === "Right") ||
        (directionRef.current === "Right" &&
          directions[e.keyCode] === "Left") ||
        (directionRef.current === "Up" && directions[e.keyCode] === "Down") ||
        (directionRef.current === "Down" && directions[e.keyCode] === "Up")
      )
        return;

      directionRef.current = directions[e.keyCode];
    });
  }, []);

  let createFood = () => {
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let possibleCoordinates = [];
    for (let i = 0; i <= 450; i += 50) {
      possibleCoordinates.push(i);
    }
    let x = getRandomIntInclusive(0, possibleCoordinates.length - 1);
    let y = getRandomIntInclusive(0, possibleCoordinates.length - 1);

    while (
      isCollisionWithSnake(
        { x: possibleCoordinates[x], y: possibleCoordinates[y] },
        snake
      )
    ) {
      x = getRandomIntInclusive(0, possibleCoordinates.length - 1);
      y = getRandomIntInclusive(0, possibleCoordinates.length - 1);
    }

    setFood({ x: possibleCoordinates[x], y: possibleCoordinates[y] });
  };
  React.useEffect(() => {
    createFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let isCollisionWithSnake = (head, rest) => {
    for (let body of rest) {
      if (head.x === body.x && head.y === body.y) {
        return true;
      }
    }
    return false;
  };

  let isHeadOutsideBounds = (head) => {
    if (head.x >= 500 || head.y >= 500 || head.x < 0 || head.y < 0) return true;
    return false;
  };

  React.useEffect(() => {
    ateFood.current = false;
    let move = () => {
      setSnake(
        snake.flatMap((bodyPart, i) => {
          if (!directionRef.current) return bodyPart;

          // First element is the head of the snake
          if (i === 0) {
            if (directionRef.current === "Right") {
              let newHead = {
                x: bodyPart.x + 50,
                y: bodyPart.y,
              };

              if (isHeadOutsideBounds(newHead)) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (isCollisionWithSnake(newHead, snake.slice(1, snake.length))) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFood.current = true;
                return [newHead, bodyPart];
              }

              return newHead;
            }
            if (directionRef.current === "Down") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y + 50,
              };
              if (isHeadOutsideBounds(newHead)) {
                gameOverRef.current = true;
                return bodyPart;
              }
              if (isCollisionWithSnake(newHead, snake.slice(1, snake.length))) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFood.current = true;
                return [newHead, bodyPart];
              }
              return newHead;
            }
            if (directionRef.current === "Left") {
              let newHead = {
                x: bodyPart.x - 50,
                y: bodyPart.y,
              };
              if (isHeadOutsideBounds(newHead)) {
                gameOverRef.current = true;
                return bodyPart;
              }
              if (isCollisionWithSnake(newHead, snake.slice(1, snake.length))) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFood.current = true;
                return [newHead, bodyPart];
              }
              return newHead;
            }
            if (directionRef.current === "Up") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y - 50,
              };
              if (isHeadOutsideBounds(newHead)) {
                gameOverRef.current = true;
                return bodyPart;
              }
              if (isCollisionWithSnake(newHead, snake.slice(1, snake.length))) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFood.current = true;
                return [newHead, bodyPart];
              }
              return newHead;
            }
            return null;
          } else {
            // If game was over, we don't update body coordinates anymore.
            // Also if we ate food, during that run, the rest of the body should not move, only new head is added.
            if (gameOverRef.current || ateFood.current) {
              return bodyPart;
            }
            return {
              x: snake[i - 1].x,
              y: snake[i - 1].y,
            };
          }
        })
      );
    };
    if (!gameOverRef.current) setTimeout(move, 200);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snake]);

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: 500,
          width: 500,
          border: "1px solid gray",
        }}
      >
        {snake.map((x) => {
          return (
            <div
              key={x.x.toString() + x.y.toString()}
              style={{
                position: "absolute",
                top: x.y,
                left: x.x,
                background: "gray",
                height: 50,
                width: 50,
              }}
            ></div>
          );
        })}
        {food && (
          <div
            style={{
              position: "absolute",
              top: food.y,
              left: food.x,
              background: "green",
              height: 50,
              width: 50,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
