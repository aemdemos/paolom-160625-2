/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as specified
  const headerRow = ['Columns (columns29)'];

  // Extract all direct child divs (representing columns)
  const columns = Array.from(element.children);

  // For each column, gather its child nodes (excluding empty text nodes)
  const columnContents = columns.map(col => {
    return Array.from(col.childNodes).filter(n => (
      !(n.nodeType === 3 && n.textContent.trim() === '') // 3 == TEXT_NODE
    ));
  });

  // Flatten content: if a column has a single element, use that, else array
  const flattened = columnContents.map(nodes => (nodes.length === 1 ? nodes[0] : nodes));
  // For the Columns block, combine all columns into a single cell (as an array)
  const contentRow = [flattened];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
