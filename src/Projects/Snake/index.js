import React from "react";

// Classic snake game

const SNAKE_CELL_SIDE_LENGTH = 25;
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;

let generateSnakeFromRightToLeft = (startX, startY, length) => {
  if (startX + SNAKE_CELL_SIDE_LENGTH - length * SNAKE_CELL_SIDE_LENGTH < 0)
    return [];
  if (startX > BOARD_WIDTH - SNAKE_CELL_SIDE_LENGTH) return [];

  let snake = [];
  for (let i = 0; i < length; i++) {
    snake.push({
      x: startX - i * SNAKE_CELL_SIDE_LENGTH,
      y: startY,
    });
  }
  return snake;
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let getValidCellCoordinates = () => {
  let validCoordinatesX = [];
  let validCoordinatesY = [];

  for (
    let i = 0;
    i <= BOARD_WIDTH - SNAKE_CELL_SIDE_LENGTH;
    i += SNAKE_CELL_SIDE_LENGTH
  ) {
    validCoordinatesX.push(i);
  }
  for (
    let i = 0;
    i <= BOARD_HEIGHT - SNAKE_CELL_SIDE_LENGTH;
    i += SNAKE_CELL_SIDE_LENGTH
  ) {
    validCoordinatesY.push(i);
  }

  return { validCoordinatesX, validCoordinatesY };
};

let VALID_CELL_COORDINATES = getValidCellCoordinates();

export default function Snake() {
  let [snake, setSnake] = React.useState(
    generateSnakeFromRightToLeft(100, 100, 3)
  );
  let directionsRef = React.useRef([]);

  let gameOverRef = React.useRef(false);
  let [food, setFood] = React.useState();

  React.useEffect(() => {
    let storeUserClickedDirections = (e) => {
      let directions = {
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
      };
      let oppositeDirections = {
        Left: "Right",
        Right: "Left",
        Up: "Down",
        Down: "Up",
      };
      let newDirection = directions[e.keyCode];
      let currentDirection =
        directionsRef.current[directionsRef.current.length - 1];

      // Is snake trying to move to the opposite direction?
      if (currentDirection === oppositeDirections[newDirection]) {
        return;
      }

      // We store user moves in array, otherwise we were running in some problems when user pressed
      // arrow keys very quickly, the timeout was missing processing some arrow keys.
      directionsRef.current.push(newDirection);
    };

    document.addEventListener("keydown", storeUserClickedDirections);
  }, []);

  let createFood = () => {
    let { validCoordinatesX, validCoordinatesY } = VALID_CELL_COORDINATES;

    // Get indexes to random coordinates for both x and y
    let xIndex = getRandomIntInclusive(0, validCoordinatesX.length - 1);
    let yIndex = getRandomIntInclusive(0, validCoordinatesY.length - 1);

    // Make sure those coordinates don't collide with the snake though, if they do regenerate
    while (
      isCellCollidingWithOtherCells(
        {
          x: validCoordinatesX[xIndex],
          y: validCoordinatesY[yIndex],
        },
        snake
      )
    ) {
      xIndex = getRandomIntInclusive(0, validCoordinatesX.length - 1);
      yIndex = getRandomIntInclusive(0, validCoordinatesY.length - 1);
    }

    // If we get here, we can place food on these coordinates
    setFood({
      x: validCoordinatesX[xIndex],
      y: validCoordinatesY[yIndex],
    });
  };
  React.useEffect(() => {
    createFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let isCellCollidingWithOtherCells = (cell, otherCells) => {
    return !!otherCells.find((elem) => elem.x === cell.x && elem.y === cell.y);
  };

  let isCellOutsideBounds = (cell) => {
    return (
      cell.x >= BOARD_WIDTH ||
      cell.y >= BOARD_HEIGHT ||
      cell.x < 0 ||
      cell.y < 0
    );
  };

  let isValidMove = (snakeHead, snakeBody) => {
    return (
      !isCellOutsideBounds(snakeHead) &&
      !isCellCollidingWithOtherCells(
        snakeHead,
        snakeBody.slice(1, snakeBody.length)
      )
    );
  };

  React.useEffect(() => {
    let ateFoodDuringCurrentMove = false;

    // Takes care of moving the snake head to a new coordinate
    let moveHead = (currentHead, newX, newY) => {
      // New head coordinates
      let newHead = {
        x: newX,
        y: newY,
      };

      // Can we even move the head there?
      if (!isValidMove(newHead, snake)) {
        gameOverRef.current = true;
        return currentHead;
      }

      // Did we maybe eat the food?
      if (newHead.x === food?.x && newHead.y === food?.y) {
        createFood();
        ateFoodDuringCurrentMove = true;
        return [newHead, currentHead];
      }

      return newHead;
    };

    let getNewCoordinates = ({ x, y }, direction) => {
      let newCoordinates = {
        Right: [x + SNAKE_CELL_SIDE_LENGTH, y],
        Down: [x, y + SNAKE_CELL_SIDE_LENGTH],
        Left: [x - SNAKE_CELL_SIDE_LENGTH, y],
        Up: [x, y - SNAKE_CELL_SIDE_LENGTH],
      };
      return newCoordinates[direction];
    };

    let moveSnake = () => {
      setSnake(
        snake.flatMap((cell, i) => {
          if (!directionsRef.current || !directionsRef.current.length)
            return cell;

          // We process snake head, and rest of the body differently.
          // If it is the first element, it means it is the snake head.
          if (i === 0) {
            let currentDirection;

            // Are there several moves pending?
            // If yes, get the first one in current round.
            if (directionsRef.current.length > 1) {
              currentDirection = directionsRef.current.shift();
            } else {
              currentDirection = directionsRef.current[0];
            }

            return moveHead(cell, ...getNewCoordinates(cell, currentDirection));
          } else {
            // If the snake ate food in this round, we don't move the body, just append the food it ate as new head.
            // So in that case, or if the game was over, we quit here.
            if (gameOverRef.current || ateFoodDuringCurrentMove) {
              return cell;
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
          height: BOARD_HEIGHT,
          width: BOARD_WIDTH,
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
                height: SNAKE_CELL_SIDE_LENGTH,
                width: SNAKE_CELL_SIDE_LENGTH,
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
              height: SNAKE_CELL_SIDE_LENGTH,
              width: SNAKE_CELL_SIDE_LENGTH,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
