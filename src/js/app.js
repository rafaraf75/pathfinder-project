/* global AOS */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init(); // Animacje AOS - NIE ZMIENIAMY
  } else {
    console.error('AOS is not defined. Sprawdź, czy skrypt AOS ładuje się poprawnie.');
  }

  loadPage('about'); // Domyślnie ładuje stronę About

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
  if (!content) return;

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
            <img src="./images/1.jpg" alt="Travelers">
            <div class="text-wrapper">
              <div class="text-content">
                <h2>Plan Your Journeys</h2>
                <p>Pick attractions and book hotels</p>
              </div>
            </div>
          </div>
          <div class="info-box large" data-aos="fade-up" data-aos-offset="200" data-aos-delay="300" data-aos-duration="1000">
            <img src="images/2.jpg" alt="Scenic Road">
            <div class="text-wrapper">
              <div class="text-content">
                <h2>Minimalize Boredom</h2>
                <p>Pick routes that are short and attractive</p>
              </div>
            </div>
          </div>
        </section>
      `;
    AOS.refresh(); // NIE USUWAMY AOS
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
        <h2 class="finder-title">DRAW ROUTES</h2>
        <div id="grid-container" class="grid-container"></div>
        <button id="action-button" class=" action-button btn btn-primary mt-3">Finish drawing</button>
      </section>
    `;

      // Sprawdzamy, czy `grid.js` i `pathfinder.js` są już załadowane
      if (!window.gridLoaded) {
        window.gridLoaded = true;
        loadScript('js/grid.js', () => {
          if (typeof window.initializeGrid === 'function') {
            window.initializeGrid();
          } else {
            console.error('initializeGrid is not defined!');
          }
        });
      }

      if (!window.pathfinderLoaded) {
        window.pathfinderLoaded = true;
        loadScript('js/pathfinder.js');
      }
    }
  }

  updateFooter();
}

function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = callback || function () {};
  document.body.appendChild(script);
}

// Zapobiegamy podwójnemu dodawaniu footera
function updateFooter() {
  let existingFooter = document.querySelector('.custom-footer');
  if (existingFooter) return;

  let footer = document.createElement('footer');
  footer.classList.add('custom-footer', 'text-center', 'p-3');
  footer.innerHTML = `<p>All rights reserved.</p>`;
  document.body.appendChild(footer);
}
