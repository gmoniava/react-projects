import React from "react";

export default function Snake() {
  let [snake, setSnake] = React.useState([
    { x: 100, y: 100 },
    { x: 50, y: 100 },
    { x: 0, y: 100 },
  ]);

  let direction = React.useRef();
  let gameOver = React.useRef(false);

  React.useEffect(() => {
    document.addEventListener("keydown", function (e) {
      let directions = {
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
      };

      direction.current = directions[e.keyCode];
    });
  }, []);

  React.useEffect(() => {
    let move = () => {
      setSnake((ps) => {
        return ps.map((snake, i) => {
          if (!direction.current) return snake;

          // head
          if (i === 0) {
            if (direction.current === "Right") {
              if (snake.x < 450) {
                return {
                  x: snake.x + 50,
                  y: snake.y,
                };
              } else {
                gameOver.current = true;
                clearInterval(interval);
                return snake;
              }
            }
            if (direction.current === "Down") {
              if (snake.y < 450) {
                return {
                  x: snake.x,
                  y: snake.y + 50,
                };
              } else {
                gameOver.current = true;
                clearInterval(interval);
                return snake;
              }
            }
            if (direction.current === "Left") {
              if (snake.x > 0) {
                return {
                  x: snake.x - 50,
                  y: snake.y,
                };
              } else {
                gameOver.current = true;
                clearInterval(interval);
                return snake;
              }
            }
            if (direction.current === "Up") {
              if (snake.y > 0) {
                return {
                  x: snake.x,
                  y: snake.y - 50,
                };
              } else {
                gameOver.current = true;
                clearInterval(interval);
                return snake;
              }
            }

            return snake;
          } else {
            if (gameOver.current) {
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
