import React from "react";

export default function Snake() {
  let [snake, setSnake] = React.useState([
    { x: 100, y: 100 },
    { x: 50, y: 100 },
    { x: 0, y: 100 },
  ]);

  let directionRef = React.useRef();
  let gameOverRef = React.useRef(false);

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

  React.useEffect(() => {
    let gameOver = () => {
      gameOverRef.current = true;
      clearInterval(interval);
    };
    let move = () => {
      setSnake((ps) => {
        return ps.map((snake, i) => {
          if (!directionRef.current) return snake;

          // head
          if (i === 0) {
            if (directionRef.current === "Right") {
              if (snake.x < 450) {
                return {
                  x: snake.x + 50,
                  y: snake.y,
                };
              } else {
                gameOver();
                return snake;
              }
            }
            if (directionRef.current === "Down") {
              if (snake.y < 450) {
                return {
                  x: snake.x,
                  y: snake.y + 50,
                };
              } else {
                gameOver();
                return snake;
              }
            }
            if (directionRef.current === "Left") {
              if (snake.x > 0) {
                return {
                  x: snake.x - 50,
                  y: snake.y,
                };
              } else {
                gameOver();
                return snake;
              }
            }
            if (directionRef.current === "Up") {
              if (snake.y > 0) {
                return {
                  x: snake.x,
                  y: snake.y - 50,
                };
              } else {
                gameOver();
                return snake;
              }
            }

            return snake;
          } else {
            if (gameOverRef.current) {
              return snake;
            }
            return {
              x: ps[i - 1].x,
              y: ps[i - 1].y,
            };
          }
        });
      });
    };
    let interval = setInterval(move, 500);
  }, []);

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: 500,
          width: 500,
          border: "1px solid red",
        }}
      >
        {snake.map((x) => {
          return (
            <div
              style={{
                position: "absolute",
                top: x.y,
                left: x.x,
                border: "1px solid blue",
                height: 50,
                width: 50,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
