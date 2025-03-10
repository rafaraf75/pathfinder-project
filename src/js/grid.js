/* eslint-disable quotes */

// Globalne ustawienia i zmienne
window.gridSize = 10;
window.grid = [];
window.start = null;
window.end = null;
window.currentStep = 1;
window.firstClick = true;

window.initializeGrid = function () {
  console.log('Uruchomiono initializeGrid!');
  const gridContainer = document.getElementById('grid-container');
  if (!gridContainer) {
    console.error('Błąd: Nie znaleziono kontenera siatki!');
    return;
  }

  // Czyścimy zawartość kontenera, aby zacząć od nowa.
  gridContainer.innerHTML = '';
  window.grid = [];

  // Tworzymy siatkę 10x10
  for (let row = 0; row < window.gridSize; row++) {
    window.grid[row] = [];
    for (let col = 0; col < window.gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      // Zapisujemy informacje o pozycji w atrybutach data
      cell.dataset.row = row;
      cell.dataset.col = col;
      window.grid[row][col] = 0;
      // Przypisujemy obsługę kliknięcia do komórki
      cell.addEventListener('click', handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
  console.log('Siatka wygenerowana!');
  console.log('Liczba dzieci w gridContainer:', gridContainer.childElementCount);
};

// Obsługa kliknięcia w kratkę
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (window.currentStep === 1) {
    // Etap 1: Rysowanie tras.
    if (window.firstClick || canSelect(row, col)) {
      cell.classList.add('obstacle');
      window.grid[row][col] = 1;
      window.firstClick = false;
      updateAvailableCells();
    } else {
      alert('Możesz zaznaczyć tylko przylegające pola!');
    }
  } else if (window.currentStep === 2) {
    // Etap 2: Wybór punktu startowego i końcowego.
    if (!window.start) {
      window.start = { row, col };
      cell.classList.remove('obstacle', 'available');
      cell.classList.add('start');
      window.grid[row][col] = 2; // Start jako część ścieżki
      console.log("Start ustawiony na:", window.start);
    } else if (!window.end) {
      // Ustawiamy punkt końcowy
      window.end = { row, col };
      cell.classList.remove('obstacle', 'available');
      cell.classList.add('end');
      window.grid[row][col] = 2; // Koniec też jako część ścieżki
      window.currentStep = 3;
      alert("Teraz możesz obliczyć trasę!");
    }
  }
  // Po każdym kliknięciu aktualizujemy UI (tytuł, tekst przycisku)
  updateStepUI();
}

// Sprawdzenie, czy można zaznaczyć pole
function canSelect(row, col) {
  if (window.grid[row][col] === 1) return false;
  return (
    (row > 0 && window.grid[row - 1][col] === 1) ||
    (row < window.gridSize - 1 && window.grid[row + 1][col] === 1) ||
    (col > 0 && window.grid[row][col - 1] === 1) ||
    (col < window.gridSize - 1 && window.grid[row][col + 1] === 1)
  );
}

// Aktualizacja podświetlenia dostępnych pól
function updateAvailableCells() {
  document.querySelectorAll('.grid-cell').forEach((cell) => {
    cell.classList.remove('available');
  });

  for (let row = 0; row < window.gridSize; row++) {
    for (let col = 0; col < window.gridSize; col++) {
      if (canSelect(row, col)) {
        document.querySelector(`[data-row='${row}'][data-col='${col}']`).classList.add('available');
      }
    }
  }
}

// Obsługa kliknięcia w "Find Route" – listener ustawiony raz globalnie
document.getElementById('action-button').addEventListener('click', function () {
  const button = document.getElementById('action-button');
  const btnText = button.innerText;

  // 1) Jeśli przycisk to "Try Again" -> resetuj
  if (btnText === "Try Again") {
    window.resetGrid();
  }
  // 2) Jeśli jesteśmy w kroku 1 -> zakończ rysowanie i przejdź do kroku 2
  else if (window.currentStep === 1) {
    window.currentStep = 2;
    document.querySelectorAll('.grid-cell.available').forEach(c => c.classList.remove('available'));
    alert('Teraz wybierz pole startowe i końcowe!');
  }
  // 3) Jeśli jesteśmy w kroku 3 -> oblicz trasę
  else if (window.currentStep === 3) {
    console.log('Uruchamiam findPath()...');
    window.findPath();
  }
});

// Aktualizacja UI
function updateStepUI() {
  const title = document.querySelector('.finder-title');
  const button = document.getElementById('action-button');

  if (window.currentStep === 1) {
    title.innerText = "DRAW ROUTES";
    button.innerText = "Find Route";
  } else if (window.currentStep === 2) {
    title.innerText = "SELECT START AND END";
    button.innerText = "Compute Path";
  } else if (window.currentStep === 3) {
    title.innerText = "CALCULATING PATH...";
    button.innerText = "Find Route";
  }
}
