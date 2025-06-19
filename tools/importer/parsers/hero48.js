/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example: single cell "Hero"
  const headerRow = ['Hero'];

  // 2. Extract background image (if any)
  // Find first <img> in the whole section
  const img = element.querySelector('img');

  // 3. Extract title (heading), subheading (description), CTA (link)
  // Title: look for h1, h2, or h3 in typical hero block wrappers
  let heading = element.querySelector('.card-title h1, .card-title h2, .card-title h3, h1, h2, h3');
  // Subheading: typically inside .card-text, fallback to first <p> in right column
  let subheading = element.querySelector('.card-text p') || element.querySelector('.card-text');
  // CTA: first <a> with .btn or .btn-primary
  let cta = element.querySelector('a.btn, a.btn-primary');

  // Build content cell for 3rd row: heading, subheading, cta, each separated by <br> if present
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) {
    if (contentCell.length) contentCell.push(document.createElement('br'));
    contentCell.push(subheading);
  }
  if (cta) {
    if (contentCell.length) contentCell.push(document.createElement('br'));
    contentCell.push(cta);
  }
  // If no content found, ensure cell is empty string
  const combinedContent = contentCell.length ? contentCell : '';

  // Compose the rows in the order: header, image, content
  const rows = [
    headerRow,
    [img || ''],
    [combinedContent]
  ];

  // Create and replace table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
