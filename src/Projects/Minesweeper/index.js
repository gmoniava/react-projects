import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

let BOARD_WIDTH = 10;
let BOARD_HEIGHT = 10;

export default function App() {
  let getNeighbors = (y, x) => {
    let neighbors = [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
    ];

    return neighbors.map(([offsetY, offsetX]) => [y + offsetY, x + offsetX]);
  };
  let generateSomeUniqueNumbers = (howMany, minInclusive, maxInclusive) => {
    var arr = [];
    while (arr.length < howMany) {
      var rand =
        Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) +
        minInclusive;

      if (arr.indexOf(rand) === -1) arr.push(rand);
    }
    return arr;
  };

  let assignNumbersToCellsNearMines = (board, minesCoordinates) => {
    for (let [y, x] of minesCoordinates) {
      let neighbors = getNeighbors(y, x);

      for (let [ny, nx] of neighbors) {
        if (
          ny >= 0 &&
          nx >= 0 &&
          ny < board.length &&
          nx < board[ny].length &&
          board[ny][nx].value !== "Mine"
        ) {
          board[ny][nx].value = (board[ny][nx].value || 0) + 1;
        }
      }
    }
  };

  let createBoard = (width, height) => {
    let initBoard = () => {
      let board = [];
      for (let y = 0; y < height; y++) {
        board[y] = [];
        for (let x = 0; x < width; x++) {
          board[y][x] = { value: null, revealed: false, flag: false };
        }
      }
      return board;
    };

    let createMinesOnBoard = (board) => {
      let mineCoordinates = generateSomeUniqueNumbers(
        10,
        0,
        height * width - 1
      ).map((x) => [Math.floor(x / 10), x % 10]);

      mineCoordinates.forEach(([y, x]) => {
        board[y][x].value = "Mine";
      });
      return mineCoordinates;
    };

    let board = initBoard();
    let minesCoordinates = createMinesOnBoard(board);
    assignNumbersToCellsNearMines(board, minesCoordinates);
    return board;
  };

  let reveal = (y, x, board) => {
    board[y][x].revealed = true;

    let neighbors = getNeighbors(y, x);

    for (let [ny, nx] of neighbors) {
      if (
        ny >= 0 &&
        ny < board.length &&
        nx >= 0 &&
        nx < board[y].length &&
        !board[ny][nx].revealed &&
        !board[ny][nx].flag
      ) {
        if (board[ny][nx].value == null) {
          reveal(ny, nx, board);
        } else if (board[ny][nx].value !== "Mine") {
          board[ny][nx].revealed = true;
        }
      }
    }
  };

  let countPropertyForAllCells = (board, propName) => {
    let count = 0;
    for (let row of board)
      for (let box of row) {
        if (box[propName]) count++;
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
                if (board[y][x].flag) return;

                if (boardItem.value === null) {
                  // This is empty cell, reveal it and its other empty neighbors
                  let clone = JSON.parse(JSON.stringify(board));
                  reveal(y, x, clone);
                  setBoard(clone);
                } else if (boardItem.value === "Mine") {
                  setIsGameOver(true);
                } else {
                  // We hit cell with number, just reveal that one
                  setBoard((ps) => {
                    ps[y][x].revealed = true;
                  });
                }
              } else if (e.type === "contextmenu") {
                e.preventDefault();

                // Can use maximum 10 flags
                if (
                  !board[y][x].flag &&
                  countPropertyForAllCells(board, "flag") === 10
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
                      // Show the flags. Use green one if user correctly guessed it.
                      color:
                        (gameOver || userWon) && cell.value === "Mine"
                          ? "green"
                          : "black",
                    }}
                  />
                );
              }

              // We show mines only when user loses.
              if (gameOver && cell.value === "Mine") {
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
      {gameOver && <h3 style={{ color: "red" }}> You lost </h3>}
    </div>
  );
}
