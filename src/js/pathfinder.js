window.findPath = function () {
  if (!window.start || !window.end) {
    alert('Wybierz punkt startowy i końcowy!');
    return;
  }
  console.log('Szukam ścieżki BFS...');

  let queue = [{ row: window.start.row, col: window.start.col, path: [] }];
  let visited = new Set();
  let directions = [
    { dr: -1, dc: 0 }, // Góra
    { dr: 1, dc: 0 }, // Dół
    { dr: 0, dc: -1 }, // Lewo
    { dr: 0, dc: 1 }, // Prawo
  ];

  while (queue.length > 0) {
    let { row, col, path } = queue.shift();
    console.log(`Sprawdzam kratkę: (${row}, ${col})`);

    if (row === window.end.row && col === window.end.col) {
      console.log('Znaleziono ścieżkę!', path.concat([{ row, col }]));
      drawPath(path.concat([{ row, col }])); // Rysujemy ścieżkę
      return;
    }

    let key = `${row},${col}`;
    if (visited.has(key)) {
      console.log(`Pomijam kratkę (${row}, ${col}) - już odwiedzona.`);
      continue; // Jeśli już odwiedzone, pomijamy
    }
    visited.add(key);

    for (let { dr, dc } of directions) {
      let newRow = row + dr;
      let newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < window.gridSize &&
        newCol >= 0 &&
        newCol < window.gridSize &&
        window.grid[newRow][newCol] !== 1 && // Sprawdza, czy nie jest przeszkodą
        !visited.has(`${newRow},${newCol}`)
      ) {
        console.log(`Dodaję kratkę (${newRow}, ${newCol}) do kolejki`);
        queue.push({
          row: newRow,
          col: newCol,
          path: path.concat([{ row, col }]),
        });
      } else {
        console.log(`Kratka (${newRow}, ${newCol}) jest blokowana!`);
      }
    }
  }

  alert('Nie znaleziono ścieżki!');
};

function drawPath(path) {
  console.log('Rysuję znalezioną ścieżkę:', path);
  for (let i = 0; i < path.length; i++) { // Nie kolorujemy startu i końca
    let { row, col } = path[i];
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell) {
      cell.classList.add('path');
    }
  }
}
