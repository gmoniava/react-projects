import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

let BOARD_WIDTH = 10;
let BOARD_HEIGHT = 10;

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

  let createBoard = (width, height) => {
    let result = [];
    for (let y = 0; y < height; y++) {
      result[y] = [];
      for (let x = 0; x < width; x++) {
        result[y][x] = { value: null, revealed: false, flag: false };
      }
    }

    let createMines = () => {
      let mineCoordinates = generateUniqueInts(10, 0, height * width - 1).map((x) => [
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
        !board[ny][nx].revealed
      ) {
        if (board[ny][nx].value == null) {
          reveal(nx, ny, board);
        } else if (board[ny][nx].value !== "M") {
          board[ny][nx].revealed = true;
        }
      }
    }
  };

  let countPropertyForAllCells = (board, propName, countForOnlyNotRevealed) => {
    let count = 0;
    for (let row of board)
      for (let box of row) {
        if (countForOnlyNotRevealed) {
          if (box[propName] && !box.revealed) count++;
        } else {
          if (box[propName]) count++;
        }
      }
    return count;
  };

  let [board, setBoard] = useImmer(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
  let [gameOver, setIsGameOver] = React.useState(false);
  let userWon =
    countPropertyForAllCells(board, "revealed") ===
    BOARD_HEIGHT * BOARD_WIDTH - 10;

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
                // If we get here user clicked right mouse btn.

                // Can use maximum 10 flags
                if (
                  !board[y][x].flag &&
                  countPropertyForAllCells(board, "flag", true) === 10
                ) {
                  return;
                }
                setBoard((ps) => {
                  ps[y][x].flag = !ps[y][x].flag;
                });
              }
            };
            let renderCellContent = (cell) => {
              if (cell.revealed) {
                return cell.value;
              }

              if (cell.flag) {
                return (
                  <FlagOutlined
                    style={{
                      color: gameOver && cell.value === "M" ? "green" : "black",
                    }}
                  />
                );
              }

              if (gameOver && cell.value === "M") {
                return <AlertOutlined style={{ color: "red" }} />;
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
                {renderCellContent(boardItem)}
              </button>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div style={{ padding: 10 }}>
      <h1>Welcome to minesweeper</h1>
      <div style={{ marginBottom: 10 }}>
        Remaining flags: {10 - countPropertyForAllCells(board, "flag", true)}
      </div>
      <div style={{}}>{drawBoard(board)}</div>
      {userWon && <div style={{ color: "green" }}> You won </div>}
      {gameOver && <h3 style={{ color: "red" }}> You lost :( </h3>}
    </div>
  );
}
