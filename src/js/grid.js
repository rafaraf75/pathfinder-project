const gridSize = 10; // 10x10 siatka
let grid = [];
let start = null;
let end = null;

function createGrid() {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';
  grid = [];

  for (let row = 0; row < gridSize; row++) {
    let rowArray = [];
    for (let col = 0; col < gridSize; col++) {
      let cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      gridContainer.appendChild(cell);
      rowArray.push(0); // 0 oznacza puste pole
    }
    grid.push(rowArray);
  }
}

function handleCellClick(event) {
  let row = parseInt(event.target.dataset.row);
  let col = parseInt(event.target.dataset.col);

  if (!start) {
    start = { row, col };
    event.target.classList.add('start');
  } else if (!end) {
    end = { row, col };
    event.target.classList.add('end');
  } else {
    grid[row][col] = 1; // 1 oznacza przeszkodę
    event.target.classList.add('obstacle');
  }
}

// Uruchomienie generowania siatki
document.addEventListener('DOMContentLoaded', createGrid);
