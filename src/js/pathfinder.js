window.findPath = function () {
  if (!window.start || !window.end) {
    alert('Wybierz punkt startowy i końcowy!');
    return;
  }

  console.log('🔍 Szukam ścieżki BFS...');
  console.log('Start:', window.start, ' End:', window.end);

  function isWalkable(row, col) {
    return (
      row >= 0 &&
      row < window.gridSize &&
      col >= 0 &&
      col < window.gridSize &&
      (window.grid[row][col] === 1 || window.grid[row][col] === 2) // Umożliwiamy przejście tylko po zaznaczonych polach
    );
  }

  let queue = [{ row: window.start.row, col: window.start.col, path: [] }];
  let visited = Array.from({ length: window.gridSize }, () =>
    Array(window.gridSize).fill(false)
  );
  let directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];

  visited[window.start.row][window.start.col] = true;

  let shortestPath = null;
  let longestPath = null;
  let allPaths = [];

  while (queue.length > 0) {
    let { row, col, path } = queue.shift();

    if (row === window.end.row && col === window.end.col) {
      let completedPath = path.concat([{ row, col }]);
      allPaths.push(completedPath);

      if (!shortestPath || completedPath.length < shortestPath.length) {
        shortestPath = completedPath;
      }

      if (!longestPath || completedPath.length > longestPath.length) {
        longestPath = completedPath;
      }
    }

    for (let { dr, dc } of directions) {
      let newRow = row + dr;
      let newCol = col + dc;

      if (isWalkable(newRow, newCol) && !visited[newRow][newCol]) {
        visited[newRow][newCol] = true;
        queue.push({
          row: newRow,
          col: newCol,
          path: path.concat([{ row, col }])
        });
      }
    }
  }

  if (!shortestPath) {
    alert(' Nie znaleziono ścieżki!');
    return;
  }

  // Jeśli najdłuższa i najkrótsza są równe, oznacza to, że BFS nie znalazł dłuższej trasy, co sugeruje błąd w BFS.
  if (!longestPath || longestPath.length === shortestPath.length) {
    console.warn(' Najdłuższa i najkrótsza trasa mają taką samą liczbę pól – szukam dłuższej trasy...');
    longestPath = findLongestPath();
  }

  drawPath(shortestPath);
  showSummary(shortestPath, longestPath);
};

// Funkcja do znajdowania najdłuższej ścieżki (DFS zamiast BFS)
function findLongestPath() {
  let longestPath = [];
  let stack = [{ row: window.start.row, col: window.start.col, path: [] }];
  let visited = Array.from({ length: window.gridSize }, () =>
    Array(window.gridSize).fill(false)
  );

  while (stack.length > 0) {
    let { row, col, path } = stack.pop();

    if (row === window.end.row && col === window.end.col) {
      let completedPath = path.concat([{ row, col }]);
      if (completedPath.length > longestPath.length) {
        longestPath = completedPath;
      }
    }

    for (let { dr, dc } of [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }]) {
      let newRow = row + dr;
      let newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < window.gridSize &&
        newCol >= 0 &&
        newCol < window.gridSize &&
        (window.grid[newRow][newCol] === 1 || window.grid[newRow][newCol] === 2) &&
        !visited[newRow][newCol]
      ) {
        visited[newRow][newCol] = true;
        stack.push({
          row: newRow,
          col: newCol,
          path: path.concat([{ row, col }])
        });
      }
    }
  }

  return longestPath;
}
// Funkcja rysowania znalezionej ścieżki
function drawPath(path) {
  path.forEach(({ row, col }) => {
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell) {
      cell.classList.add('path');
      cell.style.backgroundColor = 'green';
    }
  });

  // Ustawiamy kolor dla startu i mety na jaśniejszy zielony
  let startCell = document.querySelector(`[data-row='${window.start.row}'][data-col='${window.start.col}']`);
  let endCell = document.querySelector(`[data-row='${window.end.row}'][data-col='${window.end.col}']`);

  if (startCell) {
    startCell.style.backgroundColor = 'green';
    startCell.classList.add('path');
  }

  if (endCell) {
    endCell.style.backgroundColor = 'green';
    endCell.classList.add('path');
  }
}

// Funkcja wyświetlania podsumowania
function showSummary(shortestPath, longestPath) {
  let totalFields = document.querySelectorAll('.obstacle').length + 2; // Przeszkody + start + end

  let modal = document.createElement('div');
  modal.id = 'summary-modal';
  modal.style.position = 'fixed';
  modal.style.top = '40%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.padding = '20px';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '10px';
  modal.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  modal.style.zIndex = '1000';
  modal.style.display = 'block';
  modal.innerHTML = `
    <h2>SUMMARY</h2>
    <p><strong>FULL ROUTE:</strong> <span style="color: orange;">${totalFields}</span> FIELDS</p>
    <p><strong>THE LONGEST ROUTE:</strong> <span style="color: red;">${longestPath ? longestPath.length : 'N/A'}</span> FIELDS</p>
    <p><strong>THE SHORTEST ROUTE:</strong> <span style="color: green;">${shortestPath.length}</span> FIELDS</p>
    <button id="close-modal" style="position: absolute; top: 10px; right: 10px;">X</button>
  `;

  // Dodaj modal do body
  document.body.appendChild(modal);

  // Obsługa zamknięcia modala
  document.getElementById('close-modal').addEventListener('click', function () {
    modal.style.display = 'none';
  });
}
