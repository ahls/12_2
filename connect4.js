/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player
{
  constructor(color, id)
  {
    this.color =color;
    this.id = id;
  }
}

class Game {
  constructor(WIDTH, HEIGHT, player1Color, player2Color ) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.player1 = new Player(player1Color,1);
    this.player2 = new Player(player2Color,2);
    this.currPlayer = this.player1;
    this.board = [];
  }

  startGame()
  {
    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerText="";
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    //piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    
    const top = document.querySelector('#column-top');
    top.remove();
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.id;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      
      return this.endGame(`Player ${this.currPlayer.id} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer.id === 1 ? this.player2 : this.player1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.id
      );
    }
    let _boundWin = _win.bind(this);

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        if(this.board[y][x] !== this.currPlayer.id)
        {
          continue;
        }
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_boundWin(horiz) || _boundWin(vert) || _boundWin(diagDR) || _boundWin(diagDL)) {
          return true;
        }
      }
    }
  }
}

const player1ColorPicker = document.querySelector('input[name = "player1Color"]');
const palyer2ColorPicker = document.querySelector('input[name = "player2Color"]');
const widthInput= document.querySelector('input[name = "width"]')
const heightInput= document.querySelector('input[name = "height"]')

document.querySelector('#startButton').addEventListener('click',(e)=>
{
  e.preventDefault();
  if(widthInput.value * heightInput.value < 8)
  {
    alert("Width x Heigh should be greater than 8!");
    return;
  }
  let game = new Game(widthInput.value, heightInput.value, player1ColorPicker.value, palyer2ColorPicker.value);
  game.startGame();
})
const backgroundColorPicker = document.querySelector('#boardColor')
backgroundColorPicker.addEventListener('change',(e)=>
{
  console.log(backgroundColorPicker.value);
  e.preventDefault();
  document.body.style.backgroundColor = backgroundColorPicker.value;
})
