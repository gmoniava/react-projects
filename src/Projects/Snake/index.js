import React from "react";

// Classic snake game

const SNAKE_CELL_DIMENSION = 25;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Snake() {
  let [snake, setSnake] = React.useState([
    { x: 250, y: 100 }, // first element is the head
    { x: 250 - SNAKE_CELL_DIMENSION, y: 100 },
    { x: 250 - 2 * SNAKE_CELL_DIMENSION, y: 100 },
  ]);

  let directionsRef = React.useRef([]);

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
      let directionsAndOpposites = {
        Left: "Right",
        Right: "Left",
        Up: "Down",
        Down: "Up",
      };

      let newDirection = directions[e.keyCode];

      // Make sure user's latest move isn't to the opposite direction
      if (
        directionsRef.current[directionsRef.current.length - 1] ===
        directionsAndOpposites[newDirection]
      ) {
        return;
      }

      // For better user experience we keep directions in array and then process one by one.
      // Without array we had some user experience problems when user was pressing arrows very quickly.
      directionsRef.current.push(newDirection);
    });
  }, []);

  let createFood = () => {
    let possibleCoordinates = [];
    for (let i = 0; i <= 450; i += SNAKE_CELL_DIMENSION) {
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

  React.useEffect(() => {
    let ateFoodDuringCurrentMove = false;
    let move = () => {
      setSnake(
        snake.flatMap((bodyPart, i) => {
          if (!directionsRef.current || !directionsRef.current.length)
            return bodyPart;

          // First element is the head of the snake
          if (i === 0) {
            let currentDirection;

            // Are there several moves pending?
            if (directionsRef.current.length > 1) {
              currentDirection = directionsRef.current.shift();
            } else {
              currentDirection = directionsRef.current[0];
            }

            if (currentDirection === "Right") {
              let newHead = {
                x: bodyPart.x + SNAKE_CELL_DIMENSION,
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

              return newHead;
            }
            if (currentDirection === "Down") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y + SNAKE_CELL_DIMENSION,
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

              return newHead;
            }
            if (currentDirection === "Left") {
              let newHead = {
                x: bodyPart.x - SNAKE_CELL_DIMENSION,
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

              return newHead;
            }
            if (currentDirection === "Up") {
              let newHead = {
                x: bodyPart.x,
                y: bodyPart.y - SNAKE_CELL_DIMENSION,
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
                height: SNAKE_CELL_DIMENSION,
                width: SNAKE_CELL_DIMENSION,
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
              height: SNAKE_CELL_DIMENSION,
              width: SNAKE_CELL_DIMENSION,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
