/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the .row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  
  // 2. Get direct children - expects 2 columns for columns70
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // In this HTML, due to flex-row-reverse, first col is image, second col is text
  const imageCol = cols[0];
  const textCol = cols[1];

  // 3. Get the image element
  const img = imageCol.querySelector('img');
  // If no image present, fallback to empty string
  const col2Content = img ? img : document.createTextNode('');

  // 4. Get structured text content
  // We want to reference the card-body div containing all text content
  let col1Content;
  const cardBody = textCol.querySelector('.card-body');
  if (cardBody) {
    col1Content = cardBody;
  } else {
    // fallback to whole textCol if structure changes
    col1Content = textCol;
  }

  // 5. Construct the cells array. Header must match exactly:
  const headerRow = ['Columns (columns70)'];
  const cells = [
    headerRow,
    [col1Content, col2Content],
  ];
  
  // 6. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
