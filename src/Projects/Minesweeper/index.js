import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

let BOARD_WIDTH = 10;
let BOARD_HEIGHT = 10;
let MINE_VALUE = "Mine";

export default function App() {
  let getNeighbors = (row, col, board) => {
    let neighbors = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];

    let isCellWithinBounds = (row, col, board) => {
      return (
        row >= 0 && col >= 0 && row < board.length && col < board[row].length
      );
    };
    console.log(
      neighbors
        .map(([offsetY, offsetX]) => [row + offsetY, col + offsetX])
        .filter(([row, col]) => isCellWithinBounds(row, col, board))
    );
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

  let numberMineNeighbors = (board, minesCoordinates) => {
    for (let [row, col] of minesCoordinates) {
      getNeighbors(row, col, board).forEach(([nrow, ncol]) => {
        if (board[nrow][ncol].value !== MINE_VALUE) {
          board[nrow][ncol].value = (board[nrow][ncol].value || 0) + 1;
        }
      });
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
        board[row][col].value = MINE_VALUE;
      });
      return mineCoordinates;
    };

    let board = initEmptyBoard();
    let minesCoordinates = createMinesOnBoard(board);
    numberMineNeighbors(board, minesCoordinates);
    return board;
  };

  let reveal = (row, col, board) => {
    board[row][col].revealed = true;
    getNeighbors(row, col, board).forEach(([nrow, ncol]) => {
      if (!board[nrow][ncol].revealed && !board[nrow][ncol].flag) {
        if (board[nrow][ncol].value == null) {
          reveal(nrow, ncol, board);
        } else if (board[nrow][ncol].value !== MINE_VALUE) {
          board[nrow][ncol].revealed = true;
        }
      }
    });
  };

  let countSomePropertyOnBoard = (board, propName) => {
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
    countSomePropertyOnBoard(board, "revealed") ===
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
                } else if (boardItem.value === MINE_VALUE) {
                  setIsGameOver(true);
                } else {
                  // We hit cell with number, just reveal that one
                  setBoard((ps) => {
                    ps[row][col].revealed = true;
                  });
                }
              } else if (e.type === "contextmenu") {
                e.preventDefault();

                // We can't flag revealed cells
                if (board[row][col].revealed) return;

                // Can use maximum 10 flags
                if (
                  !board[row][col].flag &&
                  countSomePropertyOnBoard(board, "flag") === 10
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
                        (gameOver || userWon) && cell.value === MINE_VALUE
                          ? "green"
                          : "black",
                    }}
                  />
                );
              }

              // We show mines only when user loses.
              if (gameOver && cell.value === MINE_VALUE) {
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
        Remaining flags: {10 - countSomePropertyOnBoard(board, "flag")}
      </div>
      <div style={{}}>{drawBoard(board)}</div>
      {userWon && <div style={{ color: "green" }}> You won </div>}
      {gameOver && <h3 style={{ color: "red" }}> You lost </h3>}
    </div>
  );
}
