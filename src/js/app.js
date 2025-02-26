import 'bootstrap';

document.getElementById('action-button').addEventListener('click', () => {
  // eslint-disable-next-line no-undef
  if (!start || !end) {
    alert('Wybierz punkt startowy i końcowy!');
    return;
  }

  // eslint-disable-next-line no-undef
  let path = findPath(grid, start, end);
  if (path) {
    path.forEach(({ row, col }) => {
      let cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (cell) cell.classList.add('path');
    });
  } else {
    alert('Brak możliwej trasy!');
  }
});
