/* global AOS */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init(); // Inicjalizacja animacji AOS
  } else {
    console.error(
      'AOS is not defined. Sprawdź, czy skrypt AOS ładuje się poprawnie.'
    );
  }
  loadPage('about'); // Domyślnie załaduj About

  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      let page = this.getAttribute('data-page');
      loadPage(page);
    });
  });
});

function loadPage(page) {
  let content = document.getElementById('content');
  if (!content) return; // Sprawdzamy, czy kontener istnieje

  if (page === 'about') {
    content.innerHTML = `
          <section class="hero-section">
              <div class="overlay"></div>
              <div class="hero-content">
                  <h1>Pathfinder</h1>
                  <p>For Travellers</p>
              </div>
          </section>
          <section class="info-section">
              <div class="info-box small" data-aos="fade-up" data-aos-offset="200" data-aos-delay="300" data-aos-duration="1000">
                  <img src="./images/1.jpg" alt="Travelers" class="info-image">
                  <div class="text-wrapper">
                      <div class="text-content">
                          <h2>Plan Your Journeys</h2>
                          <p>Pick attractions and book hotels</p>
                      </div>
                  </div>
              </div>
              <div class="info-box large" data-aos="fade-up" data-aos-offset="200" data-aos-delay="300" data-aos-duration="1000">
                  <img src="images/2.jpg" alt="Scenic Road" class="info-image">
                  <div class="text-wrapper">
                      <div class="text-content">
                          <h2>Minimalize Boredom</h2>
                          <p>Pick routes that are short and attractive</p>
                      </div>
                  </div>
              </div>
          </section>
      `;
    AOS.refresh(); // Odśwież animacje po zmianie strony
  } else if (page === 'finder') {
    if (window.innerWidth < 768) {
      content.innerHTML = `<h2 class="text-center">This app is browser only!</h2>`;
    } else {
      content.innerHTML = `
      <section class="hero-section">
              <div class="overlay"></div>
              <div class="hero-content">
                  <h1>Pathfinder</h1>
                  <p>For Travellers</p>
              </div>
          </section>
              <section class="finder-section">
                  <h2>Draw routes</h2>
                  <div class="grid-container"></div>
                  <button id="action-button" class="btn btn-primary mt-3">Finish drawing</button>
              </section>
          `;
      initializeFinderGrid(); // Tworzymy siatkę
      setupFinder(); // Obsługa przycisku `action-button`

      loadScript('js/grid.js');
      loadScript('js/pathfinder.js');
    }
    updateFooter();
  }
}

function initializeFinderGrid() {
  let gridContainer = document.querySelector('.grid-container');
  if (!gridContainer) return;
  gridContainer.innerHTML = ''; // Wyczyść siatkę przed dodaniem nowych elementów
  for (let i = 0; i < 100; i++) {
    let cell = document.createElement('div');
    cell.classList.add('grid-cell');
    gridContainer.appendChild(cell);
  }
}

function setupFinder() {
  let actionButton = document.getElementById('action-button');
  if (!actionButton) return;

  let gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      cell.classList.toggle('selected'); // Dodaje lub usuwa klasę wybrania
    });
  });

  actionButton.addEventListener('click', () => {
    let selectedCells = document.querySelectorAll('.grid-cell.selected');
    if (selectedCells.length === 0) {
      alert('Wybierz komórki do trasy!');
      return;
    }
    alert(`Zaznaczono ${selectedCells.length} komórek!`);
  });
}

function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

// Funkcja do dynamicznego dodawania footera
function updateFooter() {
  let footer = document.createElement('footer');
  footer.classList.add('custom-footer', 'text-center', 'p-3');
  footer.innerHTML = `<p>All rights reserved.</p>`;

  let existingFooter = document.querySelector('.custom-footer');
  if (existingFooter) {
    existingFooter.remove();
  }

  document.body.appendChild(footer);
}
