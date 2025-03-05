/* eslint-disable quotes */
window.gridSize = 10;
window.grid = [];
window.start = null;
window.end = null;
window.currentStep = 1; // 1 - Przeszkody, 2 - Start/End, 3 - Szukanie trasy

window.initializeGrid = function () {
  const gridContainer = document.getElementById('grid-container');
  if (!gridContainer) {
    console.error('Błąd: Nie znaleziono kontenera siatki!');
    return;
  }

  gridContainer.innerHTML = '';
  window.grid = [];

  for (let row = 0; row < window.gridSize; row++) {
    window.grid[row] = [];
    for (let col = 0; col < window.gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      window.grid[row][col] = 0;
      cell.addEventListener('click', handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
  updateAvailableCells(); // Podświetlamy dostępne pola na start
  console.log('Siatka wygenerowana!');
};

// Aktualizacja podświetlenia dostępnych pól
function updateAvailableCells() {
  document.querySelectorAll('.grid-cell').forEach((cell) => {
    cell.classList.remove('available'); // Usuwamy stare podświetlenie
  });

  if (window.currentStep === 1) {
    for (let row = 0; row < window.gridSize; row++) {
      for (let col = 0; col < window.gridSize; col++) {
        if (canSelect(row, col)) {
          document.querySelector(`[data-row='${row}'][data-col='${col}']`).classList.add('available');
        }
      }
    }
  }
}

// Obsługa kliknięcia w kratkę
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (window.currentStep === 1) {
    // Tryb rysowania przeszkód
    if (window.grid[row][col] !== 1 && canSelect(row, col)) {
      cell.classList.add('obstacle');
      window.grid[row][col] = 1;
      updateAvailableCells(); // Aktualizacja dostępnych pól po kliknięciu
    } else {
      alert('Możesz zaznaczyć tylko przylegające pola!');
    }
  } else if (window.currentStep === 2) {
    // Tryb ustawiania punktu startowego i końcowego
    if (!window.start) {
      window.start = { row, col };
      cell.classList.add('start');
      cell.offsetHeight;
      console.log("Start ustawiony na:", window.start);
    } else if (!window.end) {
      window.end = { row, col };
      cell.classList.add('end');
      cell.offsetHeight;
      console.log("End ustawiony na:", window.end);
      window.currentStep = 3; // Przechodzimy do kroku szukania trasy
      alert("Teraz możesz obliczyć trasę!");
    }
  }
  updateStepUI();
}

// 🔹 Sprawdzenie, czy można zaznaczyć pole
function canSelect(row, col) {
  if (window.grid[row][col] === 1) return false; // Już zaznaczone

  if (row > 0 && window.grid[row - 1][col] === 1) return true;
  if (row < window.gridSize - 1 && window.grid[row + 1][col] === 1) return true;
  if (col > 0 && window.grid[row][col - 1] === 1) return true;
  if (col < window.gridSize - 1 && window.grid[row][col + 1] === 1) return true;

  return document.querySelectorAll('.obstacle').length === 0;
}

// Obsługa kliknięcia w "Finish Drawing"
document.getElementById('action-button').addEventListener('click', function () {
  if (window.currentStep === 1) {
    window.currentStep = 2; // Przechodzimy do wyboru startu i mety
    alert('Teraz wybierz pole startowe i końcowe!');
  } else if (window.currentStep === 3) {
    console.log('Uruchamiam findPath()...'); // Debugging
    if (typeof window.findPath === 'function') {
      window.findPath();
    } else {
      console.error('Błąd: findPath nie jest zdefiniowane!');
    }
  }
  updateStepUI();
});

// Aktualizacja UI
function updateStepUI() {
  const title = document.querySelector('.finder-title');
  const button = document.getElementById('action-button');

  if (window.currentStep === 2) {
    title.innerText = "SELECT START AND END";
    button.innerText = "Compute Path";
  } else if (window.currentStep === 3) {
    title.innerText = "CALCULATING PATH...";
    button.innerText = "Find Route";
  }
}
