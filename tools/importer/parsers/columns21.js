/* global WebImporter */
export default function parse(element, { document }) {
  // Locate main row
  const row = element.querySelector('.row');
  if (!row) return;
  // Find all top-level column divs within the row
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  const left = cols[0];
  const right = cols[1];

  // LEFT COLUMN: find the first <img> (use as-is, do not clone)
  let img = left.querySelector('img');
  // If no image found, leave cell empty
  let leftCell = img ? img : '';

  // RIGHT COLUMN: create a container that references all content inside right
  // (Reference, do not clone, the relevant heading and body content)
  // Get heading (h1)
  const h1 = right.querySelector('h1');
  // Get the description - prefers .card-text, but will fallback if not found
  let desc = right.querySelector('.card-text');
  if (!desc) {
    // fallback: any <p> or <div> directly under right
    desc = right.querySelector('p, div:not([class])');
  }
  // Compose a div container referencing h1 and desc if they exist
  const rightContent = document.createElement('div');
  if (h1) rightContent.appendChild(h1);
  if (desc) rightContent.appendChild(desc);

  // If both are missing, make right cell blank
  let rightCell = (h1 || desc) ? rightContent : '';

  // Table header as in the example
  const headerRow = ['Columns (columns21)'];
  // Content row - image left, text right
  const contentRow = [leftCell, rightCell];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  // Replace the original element in the DOM
  element.replaceWith(block);
}
