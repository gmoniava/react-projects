import React from "react";
import { useImmer } from "use-immer";

// Minesweeper game

let Y = 10;
let X = 10;
export default function App() {
  let getNeighbors = (x, y) => {
    return [
      [x - 1, y],
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
      [x - 1, y + 1],
    ];
  };
  let generateUniqueInts = (N, minInclusive, maxInclusive) => {
    var arr = [];
    while (arr.length < N) {
      var r =
        Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) +
        minInclusive;

      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  };

  let assignNumbersToCells = (board, minesCoordinates) => {
    for (let [x, y] of minesCoordinates) {
      let neighbors = getNeighbors(x, y);

      for (let [nx, ny] of neighbors) {
        if (
          ny >= 0 &&
          nx >= 0 &&
          ny < board.length &&
          nx < board[ny].length &&
          board[ny][nx].value !== "M"
        ) {
          board[ny][nx].value = (board[ny][nx].value || 0) + 1;
        }
      }
    }
  };

  let createBoard = (n, m) => {
    let result = [];
    for (let y = 0; y < n; y++) {
      result[y] = [];
      for (let x = 0; x < m; x++) {
        result[y][x] = { value: null, visible: false };
      }
    }

    let createMines = () => {
      let mineCoordinates = generateUniqueInts(10, 0, n * m - 1).map((x) => [
        x % 10,
        Math.floor(x / 10),
      ]);

      mineCoordinates.forEach(([x, y]) => {
        result[y][x].value = "M";
      });
      return mineCoordinates;
    };

    let minesCoordinates = createMines();
    assignNumbersToCells(result, minesCoordinates);
    return result;
  };

  let reveal = (x, y, board) => {
    board[y][x].visible = true;

    let neighbors = getNeighbors(x, y);

    for (let [nx, ny] of neighbors) {
      if (
        ny >= 0 &&
        ny < board.length &&
        nx >= 0 &&
        nx < board[y].length &&
        board[ny][nx].value == null &&
        !board[ny][nx].visible
      ) {
        reveal(nx, ny, board);
      }
    }
  };
  let revealedBoxes = (board) => {
    let count = 0;
    for (let row of board)
      for (let box of row) {
        if (box.visible) count++;
      }
    return count;
  };

  let [board, setBoard] = useImmer(createBoard(Y, X));
  let [gameOver, setIsGameOver] = React.useState(false);
  let userWon = revealedBoxes(board) === Y * X - 10;

  let drawBoard = (board) => {
    return board.map((row, y) => {
      return (
        <div key={y} style={{ display: "flex", alignItems: "center" }}>
          {row.map((boardItem, x) => {
            let handleClick = (e) => {
              if (e.type === "click") {
                if (gameOver || userWon) return;
                if (boardItem.value === null) {
                  let clone = JSON.parse(JSON.stringify(board));
                  reveal(x, y, clone);
                  setBoard(clone);
                } else if (boardItem.value === "M") {
                  alert("Game over");
                  setIsGameOver(true);
                } else {
                  setBoard((ps) => {
                    ps[y][x].visible = true;
                  });
                }
              } else if (e.type === "contextmenu") {
                console.log("Right click");
                e.preventDefault();
              }
            };
            return (
              <button
                key={y.toString() + x.toString()}
                style={{
                  width: 24,
                  height: 24,
                  border: boardItem.visible ? "none" : "",
                }}
                onContextMenu={handleClick}
                onClick={handleClick}
              >
                {(boardItem.visible || (gameOver && boardItem.value === "M")) &&
                  boardItem.value}
              </button>
            );
          })}
        </div>
      );
    });
  };
  return (
    <div>
      <h1>Welcome to minesweeper</h1>
      <div style={{ padding: 10 }}>{drawBoard(board)}</div>
      <div style={{ color: "green" }}>{userWon && "You won"}</div>
    </div>
  );
}
