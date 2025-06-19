/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate <li> children (each is a column)
  const items = Array.from(element.querySelectorAll(':scope > li'));
  if (!items.length) return;

  // For each <li>, extract the <a> only (with contents)
  const columns = items.map((li) => {
    const a = li.querySelector('a');
    return a || '';
  });

  // The header row MUST be a single cell, per the spec
  const rows = [
    ['Columns (columns24)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
