/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards13)'];
  const rows = [];

  // Find all immediate card containers (columns)
  const cardContainers = element.querySelectorAll(':scope > div');

  cardContainers.forEach((container) => {
    // Find the .card inside this container
    const card = container.querySelector('.card');
    if (!card) return;

    // First cell: image (required)
    const img = card.querySelector('.card-img img');

    // Second cell: text (title, description, CTA)
    const cellContent = [];
    const cardTitle = card.querySelector('.card-title');
    if (cardTitle && cardTitle.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = cardTitle.textContent.trim();
      cellContent.push(strong);
      cellContent.push(document.createElement('br'));
    }
    const cardText = card.querySelector('.card-text');
    if (cardText && cardText.textContent.trim()) {
      cellContent.push(document.createTextNode(cardText.textContent.trim()));
      cellContent.push(document.createElement('br'));
    }
    const cta = card.querySelector('.card-footer a');
    if (cta) {
      cellContent.push(cta);
    }
    // Remove trailing <br> if present
    while (cellContent.length && cellContent[cellContent.length - 1].tagName === 'BR') {
      cellContent.pop();
    }

    rows.push([
      img ? img : '',
      cellContent.length ? cellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(
    [headerRow, ...rows],
    document
  );

  element.replaceWith(table);
}
