window.findPath = function () {
  if (!window.start || !window.end) {
    alert('Wybierz punkt startowy i końcowy!');
    return;
  }

  console.log('Szukam ścieżki BFS...');
  console.log('Start:', window.start, ' End:', window.end);

  // Sprawdza, czy dane pole jest przejściowe (obstacle=1 lub start/end=2)
  function isWalkable(row, col) {
    return (
      row >= 0 &&
      row < window.gridSize &&
      col >= 0 &&
      col < window.gridSize &&
      (window.grid[row][col] === 1 || window.grid[row][col] === 2)
    );
  }

  // Inicjalizacja kolejki BFS z punktem startowym.
  let queue = [
    {
      row: window.start.row,
      col: window.start.col,
      path: [],
    }
  ];
  // Macierz odwiedzonych komórek.
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
  let longestPath = findLongestPath(); // DFS do najdłuższej ścieżki

  while (queue.length > 0) {
    let { row, col, path } = queue.shift();

    if (row === window.end.row && col === window.end.col) {
      // Gdy dotrzemy do punktu końcowego, zapisujemy ścieżkę.
      shortestPath = path.concat([{ row, col }]);
      break;
    }

    // Przeglądamy sąsiadujące komórki.
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

  drawPath(shortestPath);
  showSummary(shortestPath, longestPath);

  document.getElementById('action-button').innerText = 'Try Again';
};

// Funkcja do resetowania siatki po kliknięciu "Try Again"
window.resetGrid = function () {
  console.log('Resetowanie siatki...');

  // Usuwamy klasy i inline style ze wszystkich komórek.
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.remove('path', 'start', 'end', 'obstacle', 'available');
    cell.style.backgroundColor = '';
  });

  // Czyścimy tablicę grid i kluczowe zmienne
  window.grid = Array.from({ length: window.gridSize }, () =>
    Array(window.gridSize).fill(0)
  );

  window.start = null;
  window.end = null;
  window.currentStep = 1;
  window.firstClick = true;

  let modal = document.getElementById('summary-modal');
  if (modal) {
    modal.remove();
  }

  // Ponowne wygenerowanie siatki i aktualizacja UI raz
  if (typeof window.initializeGrid === 'function') {
    window.initializeGrid();
  } else {
    console.error('Błąd: initializeGrid nie jest dostępne!');
  }

  if (typeof window.updateStepUI === 'function') {
    window.updateStepUI();
  } else {
    console.error('Błąd: updateStepUI nie jest dostępne!');
  }
};

// Funkcja do znajdowania najdłuższej ścieżki (DFS zamiast BFS)
function findLongestPath() {
  let longestPath = [];
  let stack = [
    {
      row: window.start.row,
      col: window.start.col,
      path: []
    }
  ];
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

    for (let { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ]) {
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
  // Najpierw usuwamy podświetlenie "available" ze wszystkich komórek.
  document.querySelectorAll('.grid-cell.available').forEach(cell => {
    cell.classList.remove('available');
  });

  // Dla każdej komórki wyliczonej ścieżki:
  path.forEach(({ row, col }) => {
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell) {
      // Usuwamy potencjalne konflikty stylów.
      cell.classList.remove('obstacle', 'start', 'end');
      // Dodajemy klasę 'path', która nadaje jasnozielony kolor.
      cell.classList.add('path');
    }
  });
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
    modal.remove();
  });
}
