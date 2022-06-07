import React from "react";
import { useImmer } from "use-immer";
import { FlagOutlined, AlertOutlined } from "@ant-design/icons";

// Minesweeper game

const CONSTANTS = {
  MINE: "Mine",
  EMPTY: null,
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 10,
  NR_OF_FLAGS: 10,
  NR_OF_MINES: 10,
};

export default function App() {
  let isCellWithinBounds = (row, col, board) => {
    return (
      row >= 0 && col >= 0 && row < board.length && col < board[row].length
    );
  };

  let getNeighbors = (row, col, board) => {
    let neighborOffsets = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];

    return neighborOffsets
      .map(([offsetY, offsetX]) => [row + offsetY, col + offsetX])
      .filter(([row, col]) => isCellWithinBounds(row, col, board));
  };

  let createGameBoard = (width, height) => {
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
    let emptyBoard = () => {
      let board = [];
      for (let row = 0; row < height; row++) {
        board[row] = [];
        for (let col = 0; col < width; col++) {
          board[row][col] = {
            value: CONSTANTS.EMPTY,
            revealed: false,
            flag: false,
          };
        }
      }
      return board;
    };

    let createMinesOnBoard = (board) => {
      let mineCoordinates = generateSomeUniqueNumbers(
        CONSTANTS.NR_OF_MINES,
        0,
        height * width - 1
      ).map((number) => [Math.floor(number / 10), number % 10]);

      mineCoordinates.forEach(([row, col]) => {
        board[row][col].value = CONSTANTS.MINE;
      });
      return mineCoordinates;
    };

    let putNumbersAroundMines = (board, minesCoordinates) => {
      for (let [row, col] of minesCoordinates) {
        getNeighbors(row, col, board).forEach(([nrow, ncol]) => {
          if (board[nrow][ncol].value !== CONSTANTS.MINE) {
            board[nrow][ncol].value = (board[nrow][ncol].value || 0) + 1;
          }
        });
      }
    };

    let initialBoard = emptyBoard();
    let minesCoordinates = createMinesOnBoard(initialBoard);
    putNumbersAroundMines(initialBoard, minesCoordinates);
    return initialBoard;
  };

  let reveal = (row, col, board) => {
    board[row][col].revealed = true;
    getNeighbors(row, col, board).forEach(([nrow, ncol]) => {
      if (!board[nrow][ncol].revealed && !board[nrow][ncol].flag) {
        if (board[nrow][ncol].value === CONSTANTS.EMPTY) {
          reveal(nrow, ncol, board);
        } else if (board[nrow][ncol].value !== CONSTANTS.MINE) {
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
  let [gameBoard, setGameBoard] = useImmer(() =>
    createGameBoard(CONSTANTS.BOARD_WIDTH, CONSTANTS.BOARD_HEIGHT)
  );
  let [gameOver, setIsGameOver] = React.useState(false);

  let userWon =
    countSomePropertyOnBoard(gameBoard, "revealed") ===
    CONSTANTS.BOARD_HEIGHT * CONSTANTS.BOARD_WIDTH - CONSTANTS.NR_OF_MINES;

  let drawBoard = (board) => {
    return board.map((rowItems, row) => {
      return (
        <div key={row} style={{ display: "flex", alignItems: "center" }}>
          {rowItems.map((boardItem, col) => {
            let handleClick = (e) => {
              if (gameOver || userWon) return;

              if (e.type === "click") {
                // If it is flagged cell, quit early.
                if (board[row][col].flag) return;

                // What kind of cell did we click?
                switch (boardItem.value) {
                  case CONSTANTS.EMPTY:
                    // Reveal this one and its empty neighbors too
                    let clone = JSON.parse(JSON.stringify(board));
                    reveal(row, col, clone);
                    setGameBoard(clone);
                    break;
                  case CONSTANTS.MINE:
                    setIsGameOver(true);
                    break;
                  default:
                    // We hit cell with number, just reveal that one
                    setGameBoard((ps) => {
                      ps[row][col].revealed = true;
                    });
                }
              } else if (e.type === "contextmenu") {
                e.preventDefault();

                // We can't flag revealed cells
                if (board[row][col].revealed) return;

                // Did we use all flags?
                if (
                  !board[row][col].flag &&
                  countSomePropertyOnBoard(board, "flag") ===
                    CONSTANTS.NR_OF_FLAGS
                ) {
                  return;
                }
                setGameBoard((ps) => {
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
                        (gameOver || userWon) && cell.value === CONSTANTS.MINE
                          ? "green"
                          : "black",
                    }}
                  />
                );
              }

              // We show mines only when user loses.
              if (gameOver && cell.value === CONSTANTS.MINE) {
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
        Remaining flags:{" "}
        {CONSTANTS.NR_OF_FLAGS - countSomePropertyOnBoard(gameBoard, "flag")}
      </div>
      <div style={{}}>{drawBoard(gameBoard)}</div>
      {userWon && <div style={{ color: "green" }}> You won </div>}
      {gameOver && <h3 style={{ color: "red" }}> You lost </h3>}
    </div>
  );
}
