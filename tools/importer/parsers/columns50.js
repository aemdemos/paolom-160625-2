/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Grab immediate column children
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  // Grab the image container, prefer .card-img, fallback to first img
  const colLeft = columns[0];
  let leftContent = null;
  const cardImgDiv = colLeft.querySelector('.card-img');
  if (cardImgDiv) {
    leftContent = cardImgDiv;
  } else {
    // fallback to first img
    const img = colLeft.querySelector('img');
    if (img) {
      leftContent = img;
    } else {
      // fallback to all content if present
      leftContent = colLeft;
    }
  }

  // --- RIGHT COLUMN ---
  const colRight = columns[1];
  const rightParts = [];
  // Heading (keep heading level)
  let heading = colRight.querySelector('.card-title h2, h2, h1, h3, h4, h5, h6');
  if (heading) rightParts.push(heading);
  // Paragraphs and lists inside .card-text or directly present
  let cardText = colRight.querySelector('.card-text');
  if (cardText) {
    // push all children individually to preserve block structure
    Array.from(cardText.children).forEach(node => {
      rightParts.push(node);
    });
  } else {
    // fallback: push any p or ul/ol directly under colRight
    colRight.querySelectorAll(':scope > p, :scope > ul, :scope > ol').forEach(el => rightParts.push(el));
  }
  // Button (anchor)
  let button = colRight.querySelector('a.btn');
  if (button) rightParts.push(button);

  // --- Compose table ---
  const cells = [
    ['Columns (columns50)'],
    [leftContent, rightParts]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
