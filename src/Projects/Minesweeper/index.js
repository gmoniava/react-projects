import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

let Y = 10;
let X = 10;
export default function App() {
  // Just returns all neighbors of a cell
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

  // Assigns numbers to cells which are in proximity to mines
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
        result[y][x] = { value: null, revealed: false, flag: false };
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
    board[y][x].revealed = true;

    let neighbors = getNeighbors(x, y);

    for (let [nx, ny] of neighbors) {
      if (
        ny >= 0 &&
        ny < board.length &&
        nx >= 0 &&
        nx < board[y].length &&
        board[ny][nx].value == null &&
        !board[ny][nx].revealed
      ) {
        reveal(nx, ny, board);
      }
    }
  };

  // Counts some property for all board cells
  let countProperty = (board, propName) => {
    let count = 0;
    for (let row of board)
      for (let box of row) {
        if (box[propName]) count++;
      }
    return count;
  };

  let [board, setBoard] = useImmer(createBoard(Y, X));
  let [gameOver, setIsGameOver] = React.useState(false);
  let userWon = countProperty(board, "revealed") === Y * X - 10;

  let drawBoard = (board) => {
    return board.map((row, y) => {
      return (
        <div key={y} style={{ display: "flex", alignItems: "center" }}>
          {row.map((boardItem, x) => {
            let handleClick = (e) => {
              if (gameOver || userWon) return;

              if (e.type === "click") {
                // We can't open flagged cells
                if (board[y][x].flag) return;

                if (boardItem.value === null) {
                  // This is empty cell, reveal it and its other empty neighbors
                  let clone = JSON.parse(JSON.stringify(board));
                  reveal(x, y, clone);
                  setBoard(clone);
                } else if (boardItem.value === "M") {
                  // Oops we hit a mine.
                  setIsGameOver(true);
                } else {
                  // We hit cell with number, just reveal that one
                  setBoard((ps) => {
                    ps[y][x].revealed = true;
                  });
                }
              } else if (e.type === "contextmenu") {
                e.preventDefault();
                // If we get here user click right mouse btn.

                // Can use maximum 10 flags
                if (!board[y][x].flag && countProperty(board, "flag") === 10) {
                  return;
                }
                setBoard((ps) => {
                  ps[y][x].flag = !ps[y][x].flag;
                });
              }
            };
            return (
              <button
                key={y.toString() + x.toString()}
                style={{
                  width: 32,
                  height: 32,
                  border: boardItem.revealed ? "none" : "",
                  padding: 0,
                }}
                onContextMenu={handleClick}
                onClick={handleClick}
              >
                {(boardItem.revealed ||
                  boardItem.flag ||
                  (gameOver && boardItem.value === "M")) &&
                  (boardItem.flag ? (
                    <FlagOutlined />
                  ) : boardItem.value === "M" ? (
                    <AlertOutlined style={{ color: "red" }} />
                  ) : (
                    boardItem.value
                  ))}
              </button>
            );
          })}
        </div>
      );
    });
  };

  console.log("Render", board);
  return (
    <div>
      <h1>Welcome to minesweeper</h1>
      <div style={{ padding: 10 }}>{drawBoard(board)}</div>
      <div style={{ color: "green" }}>{userWon && "You won"}</div>
    </div>
  );
}
