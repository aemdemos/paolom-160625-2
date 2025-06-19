/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || typeof element.querySelector !== 'function') return;

  // Find the card row containing the columns
  const cardRow = element.querySelector('.row.card-container-group');
  if (!cardRow) return;

  // Get all card columns
  const cardCols = cardRow.querySelectorAll('.card-container');
  if (!cardCols.length) return;

  // For each card column, extract relevant content for a cell
  const columns = Array.from(cardCols).map(cardCol => {
    const cellContent = [];
    const card = cardCol.querySelector('.card');
    if (card) {
      // Card Image
      const cardImg = card.querySelector('.card-img img');
      if (cardImg) cellContent.push(cardImg);

      // Card Title (prefer h4 if present)
      let cardTitle = card.querySelector('.card-title h4');
      if (!cardTitle) cardTitle = card.querySelector('.card-title');
      if (cardTitle) cellContent.push(cardTitle);

      // Card Text (all element children)
      const cardText = card.querySelector('.card-text');
      if (cardText) {
        Array.from(cardText.children).forEach(child => {
          cellContent.push(child);
        });
      }

      // Card Footer (links/buttons)
      const cardFooter = card.querySelector('.card-footer');
      if (cardFooter) {
        cardFooter.querySelectorAll('a').forEach(a => {
          cellContent.push(a);
        });
      }
    }
    // Fallback: non-breaking space if no content
    return cellContent.length ? cellContent : ['\u00A0'];
  });

  // Create the table structure: header + single row with columns for each card
  const cells = [
    ['Columns (columns6)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
