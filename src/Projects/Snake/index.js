import React from "react";

// Classic snake game

const SNAKE_SIZE = 25;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Snake() {
  let [snake, setSnake] = React.useState([
    { x: 250, y: 100 }, // first element is the head
    { x: 250 - SNAKE_SIZE, y: 100 },
    { x: 250 - 2 * SNAKE_SIZE, y: 100 },
  ]);

  let directionRef = React.useRef();
  let previousDirectionRef = React.useRef();

  let gameOverRef = React.useRef(false);
  let [food, setFood] = React.useState();

  React.useEffect(() => {
    document.addEventListener("keydown", function (e) {
      let directions = {
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
      };

      directionRef.current = directions[e.keyCode];
    });
  }, []);

  let createFood = () => {
    let possibleCoordinates = [];
    for (let i = 0; i <= 450; i += SNAKE_SIZE) {
      possibleCoordinates.push(i);
    }
    let x = getRandomIntInclusive(0, possibleCoordinates.length - 1);
    let y = getRandomIntInclusive(0, possibleCoordinates.length - 1);

    while (
      isCellCollidingWithSnake(
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

  let isCellCollidingWithSnake = (cell, rest) => {
    for (let body of rest) {
      if (cell.x === body.x && cell.y === body.y) {
        return true;
      }
    }
    return false;
  };

  let isCellOutsideBounds = (cell) => {
    if (cell.x >= 500 || cell.y >= 500 || cell.x < 0 || cell.y < 0) return true;
    return false;
  };

  let isValidMove = (snakeHead, snakeBody) => {
    if (
      isCellOutsideBounds(snakeHead) ||
      isCellCollidingWithSnake(snakeHead, snakeBody.slice(1, snakeBody.length))
    ) {
      return false;
    }
    return true;
  };

  let ignoreOppositeDirectionClick = () => {
    // If we had done similar check in keydown event by comparing current direction ref and new key code,
    // we could run into problem. If user pressed say "top" and then "right" arrow key quickly
    // while snake was going "left", and there was no time to react to "top" click in timeout,
    // we would allow snake to move to the opposite direction and eat itself.

    let directionsAndOpposites = {
      Left: "Right",
      Right: "Left",
      Up: "Down",
      Down: "Up",
    };

    if (
      directionRef.current ===
      directionsAndOpposites[previousDirectionRef.current]
    ) {
      directionRef.current = previousDirectionRef.current;
    }
  };

  React.useEffect(() => {
    let ateFoodDuringCurrentMove = false;
    let move = () => {
      setSnake(
        snake.flatMap((bodyPart, i) => {
          if (!directionRef.current) return bodyPart;

          // First element is the head of the snake
          if (i === 0) {
            ignoreOppositeDirectionClick();

            if (directionRef.current === "Right") {
              let newHead = {
                x: bodyPart.x + SNAKE_SIZE,
                y: bodyPart.y,
              };

              if (!isValidMove(newHead, snake)) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFoodDuringCurrentMove = true;
                return [newHead, bodyPart];
              }

              previousDirectionRef.current = "Right";

              return newHead;
            }
            if (directionRef.current === "Down") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y + SNAKE_SIZE,
              };
              if (!isValidMove(newHead, snake)) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFoodDuringCurrentMove = true;
                return [newHead, bodyPart];
              }
              previousDirectionRef.current = "Down";

              return newHead;
            }
            if (directionRef.current === "Left") {
              let newHead = {
                x: bodyPart.x - SNAKE_SIZE,
                y: bodyPart.y,
              };
              if (!isValidMove(newHead, snake)) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFoodDuringCurrentMove = true;
                return [newHead, bodyPart];
              }

              previousDirectionRef.current = "Left";

              return newHead;
            }
            if (directionRef.current === "Up") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y - SNAKE_SIZE,
              };
              if (!isValidMove(newHead, snake)) {
                gameOverRef.current = true;
                return bodyPart;
              }

              if (newHead.x === food?.x && newHead.y === food?.y) {
                createFood();
                ateFoodDuringCurrentMove = true;
                return [newHead, bodyPart];
              }

              previousDirectionRef.current = "Up";

              return newHead;
            }
            return bodyPart;
          } else {
            // If game was over, we don't update body coordinates anymore.
            // Also if we ate food, during that run, the rest of the body should not move, only new head is added.
            if (gameOverRef.current || ateFoodDuringCurrentMove) {
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
    if (!gameOverRef.current) setTimeout(move, 100);

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
                height: SNAKE_SIZE,
                width: SNAKE_SIZE,
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
              height: SNAKE_SIZE,
              width: SNAKE_SIZE,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
