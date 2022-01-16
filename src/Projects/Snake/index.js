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

      // Is snake trying to move to the opposite direction?
      if (
        directionsRef.current[directionsRef.current.length - 1] ===
        directionsAndOpposites[newDirection]
      ) {
        return;
      }

      // We store user moves in array, otherwise we were running in some problems when user pressed
      // arrow keys very quickly, the timeout was missing processing some arrow keys.
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

    // Takes care of moving the head snake
    let moveHead = (currentHead, newX, newY) => {
      let newHead = {
        x: newX,
        y: newY,
      };

      if (!isValidMove(newHead, snake)) {
        gameOverRef.current = true;
        return currentHead;
      }

      if (newHead.x === food?.x && newHead.y === food?.y) {
        createFood();
        ateFoodDuringCurrentMove = true;
        return [newHead, currentHead];
      }

      return newHead;
    };

    let moveSnake = () => {
      setSnake(
        snake.flatMap((bodyPart, i) => {
          if (!directionsRef.current || !directionsRef.current.length)
            return bodyPart;

          // First element is the head of the snake
          if (i === 0) {
            let currentDirection;

            // Are there several moves pending?
            // If yes, we process them one by one on different rounds.
            if (directionsRef.current.length > 1) {
              currentDirection = directionsRef.current.shift();
            } else {
              currentDirection = directionsRef.current[0];
            }

            // Keeps coordinates where snake head should go depending on direction.
            let newDirectionAndCoordinateMap = {
              Right: [bodyPart.x + SNAKE_CELL_DIMENSION, bodyPart.y],
              Down: [bodyPart.x, bodyPart.y + SNAKE_CELL_DIMENSION],
              Left: [bodyPart.x - SNAKE_CELL_DIMENSION, bodyPart.y],
              Up: [bodyPart.x, bodyPart.y - SNAKE_CELL_DIMENSION],
            };

            return moveHead(
              bodyPart,
              ...newDirectionAndCoordinateMap[currentDirection]
            );
          } else {
            // If the game was over, or we ate food in this run, no need to move the snake anymore.
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
    if (!gameOverRef.current) setTimeout(moveSnake, 100);

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
