import React from "react";

// Classic snake game

const SNAKE_CELL_SIDE_LENGTH = 25;
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;

let generateSnake = (startX, startY, length) => {
  if (startX + length * SNAKE_CELL_SIDE_LENGTH > BOARD_WIDTH) return [];

  let snake = [];
  // In our model first element in snake array should be head.
  // But since in this method we are generating snake from left to right,
  // it means the last element should be the head. Which means the last element
  // should be at the beginning of the array.
  for (let i = 0; i < length; i++) {
    snake = [
      {
        x: startX + i * SNAKE_CELL_SIDE_LENGTH,
        y: startY,
      },
    ].concat(snake);
  }
  return snake;
};

function getRandomIntInclusive(min, max) {
  let ceilMin = Math.ceil(min);
  let floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}

// We use valid cell coordinates during food generation, to know possible places
// where we can place the food randomly.
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
  let [snake, setSnake] = React.useState(generateSnake(0, 0, 10));
  let directionsRef = React.useRef([]);

  let gameOverRef = React.useRef(false);
  let [food, setFood] = React.useState();

  React.useEffect(() => {
    let storeUserClickedDirections = (e) => {
      let directionCodesToNames = {
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
      let newDirection = directionCodesToNames[e.keyCode];
      let currentDirection =
        directionsRef.current[directionsRef.current.length - 1];

      // We don't let  the snake move to the opposite direction
      if (newDirection === oppositeDirections[currentDirection]) {
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

    let generateRandomFood = () => {
      // We generate random indexes below which are used to obtain the coordinate from valid coordinates array
      let x =
        validCoordinatesX[
          getRandomIntInclusive(0, validCoordinatesX.length - 1)
        ];
      let y =
        validCoordinatesY[
          getRandomIntInclusive(0, validCoordinatesX.length - 1)
        ];

      return {
        x,
        y,
      };
    };

    let food = generateRandomFood();

    while (isCellCollidingWithOtherCells(food, snake)) {
      food = generateRandomFood();
    }

    setFood(food);
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

    let moveHead = (currentHead, newX, newY) => {
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
