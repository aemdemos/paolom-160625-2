/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children with class col-lg-4 (each column)
  const columns = Array.from(element.querySelectorAll(':scope > .col-lg-4'));
  // Edge case: If no columns, do nothing
  if (columns.length === 0) return;
  // Build the table: header row matches exactly, content row holds each whole column content
  const cells = [
    ['Columns (columns38)'],
    columns
  ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
