document.addEventListener('DOMContentLoaded', function () {
  const gridContainer = document.getElementById('grid');
  const finishButton = document.getElementById('action-button');
  const title = document.querySelector('.finder-title');
  const gridSize = 10;
  let grid = [];
  let start = null;
  let end = null;

  // Tworzenie siatki
  function createGrid() {
    gridContainer.innerHTML = '';
    grid = [];

    for (let row = 0; row < gridSize; row++) {
      grid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        grid[row][col] = 0;
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('dblclick', handleDoubleClick);
        gridContainer.appendChild(cell);
      }
    }
  }

  // Obsługa kliknięcia w komórkę
  function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (!start) {
      start = { row, col };
      cell.classList.add('start');
      grid[row][col] = 'S';
      return;
    }

    if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
      // Sprawdzenie czy sąsiaduje tylko pionowo/poziomo
      let isNeighbor = false;
      const neighbors = [
        { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
      ];

      for (let { dr, dc } of neighbors) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 && newRow < gridSize &&
          newCol >= 0 && newCol < gridSize &&
          grid[newRow][newCol] === 1
        ) {
          isNeighbor = true;
          break;
        }
      }

      if (!isNeighbor && grid.some(row => row.includes(1))) return;

      if (grid[row][col] === 0) {
        cell.classList.add('obstacle');
        grid[row][col] = 1; // Oznacz jako część trasy
      } else {
        cell.classList.remove('obstacle');
        grid[row][col] = 0; // Usuń przeszkodę
      }
    }
  }

  // Obsługa podwójnego kliknięcia
  function handleDoubleClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (grid[row][col] !== 1) return;
    if (end) {
      const oldEndCell = document.querySelector('.end');
      if (oldEndCell) {
        oldEndCell.classList.remove('end');
      }
    }
    end = { row, col };
    cell.classList.add('end');
    grid[row][col] = 'E';
  }


  // Algorytm BFS do znajdowania najkrótszej ścieżki
  function findPath() {
    if (!start || !end) {
      alert('Select start and end points first!');
      return;
    }

    let queue = [{ row: start.row, col: start.col, path: [] }];
    let visited = new Set();
    let directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    while (queue.length > 0) {
      let { row, col, path } = queue.shift();

      if (row === end.row && col === end.col) {
        drawPath(path.concat([{ row, col }]));
        return;
      }

      let key = `${row},${col}`;
      if (visited.has(key)) continue;
      visited.add(key);

      for (let { dr, dc } of directions) {
        let newRow = row + dr;
        let newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < gridSize &&
          newCol >= 0 &&
          newCol < gridSize &&
          grid[newRow][newCol] === 1 &&
          !visited.has(`${newRow},${newCol}`)
        ) {
          queue.push({
            row: newRow,
            col: newCol,
            path: path.concat([{ row, col }]),
          });
        }
      }
    }
    alert('No path found!');
  }

  // Rysowanie znalezionej ścieżki
  function drawPath(path) {
    for (let i = 1; i < path.length - 1; i++) {
      let { row, col } = path[i];
      document
        .querySelector(`[data-row='${row}'][data-col='${col}']`)
        .classList.add('path');
    }
    finishButton.textContent = 'Start Again';
    title.textContent = 'THE BEST ROUTE IS...';
  }

  // Obsługa przycisku "Finish Drawing"
  finishButton.addEventListener('click', function () {
    if (finishButton.textContent === 'Start Again') {
      resetGrid();
    } else {
      findPath();
    }
  });

  // Resetowanie siatki
  function resetGrid() {
    start = null;
    end = null;
    title.textContent = 'PICK START AND FINISH';
    finishButton.textContent = 'Compute';
    createGrid();
  }

  createGrid();
});
