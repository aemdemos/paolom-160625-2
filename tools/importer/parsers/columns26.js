/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should be a single cell, exactly as specified
  const headerRow = ['Columns (columns26)'];

  // Find columns (children of .row)
  const row = element.querySelector('.row');
  let columns = [];
  if (row) {
    columns = Array.from(row.children);
  } else {
    columns = Array.from(element.children);
  }

  // For content row: each column is a cell, contain all direct children of the col in a wrapper
  const contentRow = columns.map((col) => {
    // If only one child, just use it, else group in a <div>
    const children = Array.from(col.childNodes);
    if (children.length === 1) {
      return children[0];
    } else {
      const wrapper = document.createElement('div');
      children.forEach(child => wrapper.appendChild(child));
      return wrapper;
    }
  });

  // Build table with header row (1 cell) and content row (N cells for columns)
  const tableRows = [
    headerRow,
    contentRow
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
