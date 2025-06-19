/* global WebImporter */
export default function parse(element, { document }) {
  // Header as in the example
  const rows = [['Cards (cards30)']];

  // Find all card columns (cards)
  const cardCols = element.querySelectorAll('.row > .col-lg-4, .row > [class*="col-"]');

  cardCols.forEach((col) => {
    // Each card is in a div inside col
    const card = col.querySelector('div');
    if (!card) return;

    // Get the image (first img in card)
    const img = card.querySelector('img');

    // Get the title from image title or alt
    let titleText = '';
    if (img) {
      titleText = img.getAttribute('title') || img.getAttribute('alt') || '';
    }

    // The card description div (last div in card)
    const divs = Array.from(card.querySelectorAll('div'));
    // The most likely candidate is the last <div> (after any <br>s)
    const descDiv = divs.length > 0 ? divs[divs.length - 1] : null;

    // Build the text cell: title bold, then description
    let textCell;
    if (titleText && descDiv) {
      textCell = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(descDiv);
    } else if (descDiv) {
      textCell = descDiv;
    } else if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      textCell = strong;
    } else {
      textCell = '';
    }

    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
