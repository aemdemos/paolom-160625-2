/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from each card
  function extractCardData(cardContainer) {
    // The card could be nested: .card-container > .card > .card-body > a
    const link = cardContainer.querySelector('a');
    if (!link) return null;
    const img = link.querySelector('img');
    const title = link.querySelector('.card-title, [class*=card-title]');
    const subtitle = link.querySelector('.card-subtitle, [class*=card-subtitle]');

    // Compose text cell: subtitle as heading (strong), then title (span)
    const textCellContent = [];
    if (subtitle) {
      const strong = document.createElement('strong');
      strong.textContent = subtitle.textContent.trim();
      textCellContent.push(strong);
    }
    if (title) {
      if (subtitle) textCellContent.push(document.createElement('br'));
      const span = document.createElement('span');
      span.textContent = title.textContent.trim();
      textCellContent.push(span);
    }
    return [img, textCellContent];
  }

  // Get all card containers (handle both possible parent classes and fallback)
  let cardContainers = Array.from(element.querySelectorAll(':scope > .col-md-6, :scope > .col-lg-3, :scope > .card-container'));
  if (cardContainers.length === 0) {
    cardContainers = Array.from(element.querySelectorAll(':scope > div'));
  }
  // Only keep containers that have an image inside
  cardContainers = cardContainers.filter(c => c.querySelector('img'));

  // Compose table rows
  const rows = [['Cards (cards35)']];
  cardContainers.forEach(container => {
    const row = extractCardData(container);
    if (row) rows.push(row);
  });

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
