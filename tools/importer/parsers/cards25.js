/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards25)'];
  // Find the grid of cards
  const grid = element.querySelector('.ct-newslist-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card-container'));
  const rows = [headerRow];

  cards.forEach((card) => {
    // Get the image element
    const img = card.querySelector('img');
    // Get the title link and keep its inline content
    const cardTitleDiv = card.querySelector('.card-title');
    let titleContent = null;
    if (cardTitleDiv) {
      // Wrap in <strong> for emphasis, preserving sup/sub etc.
      const strong = document.createElement('strong');
      cardTitleDiv.childNodes.forEach((node) => {
        strong.appendChild(node.cloneNode(true));
      });
      titleContent = strong;
    }
    // Get the date element
    const dateEl = card.querySelector('.card-category .date');
    // Compose the content cell
    const contentEls = [];
    if (titleContent) {
      contentEls.push(titleContent);
    }
    if (dateEl) {
      // Add line break between title and date if both present
      if (titleContent) contentEls.push(document.createElement('br'));
      contentEls.push(dateEl);
    }
    rows.push([
      img ? img : '',
      contentEls.length === 1 ? contentEls[0] : contentEls // array so both title and date are in same cell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
