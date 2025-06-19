/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container with the buttons
  const rowDiv = element.querySelector('.row');
  if (!rowDiv) return;
  const colDiv = rowDiv.querySelector('.col-12');
  if (!colDiv) return;

  // Get all the block's CTA buttons
  const overlay = colDiv.querySelector('.card-body');
  let btns = [];
  if (overlay) {
    btns = Array.from(overlay.querySelectorAll('a.btn'));
  }

  // Create the header row matching the block name & variant exactly as one column
  const header = ['Columns (columns33)'];
  // Create content row: 3 columns, 1 button each
  const contentRow = btns;

  // Assemble table data: header row (single cell), then a row with N columns
  const cells = [header, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
