import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

let BOARD_WIDTH = 10;
let BOARD_HEIGHT = 10;

export default function App() {
  let getNeighbors = (row, col, board) => {
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

    let isCellWithinBounds = (row, col, board) => {
      return (
        row >= 0 && col >= 0 && row < board.length && col < board[row].length
      );
    };

    return neighbors
      .map(([offsetY, offsetX]) => [row + offsetY, col + offsetX])
      .filter(([row, col]) => isCellWithinBounds(row, col, board));
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
    for (let [row, col] of minesCoordinates) {
      let neighbors = getNeighbors(row, col, board);

      for (let [nrow, ncol] of neighbors) {
        if (board[nrow][ncol].value !== "Mine") {
          board[nrow][ncol].value = (board[nrow][ncol].value || 0) + 1;
        }
      }
    }
  };

  let createBoard = (width, height) => {
    let initEmptyBoard = () => {
      let board = [];
      for (let row = 0; row < height; row++) {
        board[row] = [];
        for (let col = 0; col < width; col++) {
          board[row][col] = { value: null, revealed: false, flag: false };
        }
      }
      return board;
    };

    let createMinesOnBoard = (board) => {
      let mineCoordinates = generateSomeUniqueNumbers(
        10,
        0,
        height * width - 1
      ).map((number) => [Math.floor(number / 10), number % 10]);

      mineCoordinates.forEach(([row, col]) => {
        board[row][col].value = "Mine";
      });
      return mineCoordinates;
    };

    let board = initEmptyBoard();
    let minesCoordinates = createMinesOnBoard(board);
    assignNumbersToCellsNearMines(board, minesCoordinates);
    return board;
  };

  let reveal = (row, col, board) => {
    board[row][col].revealed = true;
    let neighbors = getNeighbors(row, col, board);

    for (let [nrow, ncol] of neighbors) {
      if (!board[nrow][ncol].revealed && !board[nrow][ncol].flag) {
        if (board[nrow][ncol].value == null) {
          reveal(nrow, ncol, board);
        } else if (board[nrow][ncol].value !== "Mine") {
          board[nrow][ncol].revealed = true;
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
  let [board, setBoard] = useImmer(() =>
    createBoard(BOARD_WIDTH, BOARD_HEIGHT)
  );
  let [gameOver, setIsGameOver] = React.useState(false);

  let userWon =
    countPropertyForAllCells(board, "revealed") ===
    BOARD_HEIGHT * BOARD_WIDTH - 10;

  let drawBoard = (board) => {
    return board.map((rowItems, row) => {
      return (
        <div key={row} style={{ display: "flex", alignItems: "center" }}>
          {rowItems.map((boardItem, col) => {
            let handleClick = (e) => {
              if (gameOver || userWon) return;

              if (e.type === "click") {
                if (board[row][col].flag) return;

                if (boardItem.value === null) {
                  // This is empty cell, reveal it and its other empty neighbors
                  let clone = JSON.parse(JSON.stringify(board));
                  reveal(row, col, clone);
                  setBoard(clone);
                } else if (boardItem.value === "Mine") {
                  setIsGameOver(true);
                } else {
                  // We hit cell with number, just reveal that one
                  setBoard((ps) => {
                    ps[row][col].revealed = true;
                  });
                }
              } else if (e.type === "contextmenu") {
                e.preventDefault();

                // Can use maximum 10 flags
                if (
                  !board[row][col].flag &&
                  countPropertyForAllCells(board, "flag") === 10
                ) {
                  return;
                }
                setBoard((ps) => {
                  ps[row][col].flag = !ps[row][col].flag;
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
                key={row.toString() + col.toString()}
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
