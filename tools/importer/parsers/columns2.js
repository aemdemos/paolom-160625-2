/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get immediate child cols (expecting 2: media and text)
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // --- LEFT COLUMN (media) ---
  // Use a DIV to hold all children for clean extraction
  const mediaDiv = document.createElement('div');
  Array.from(cols[0].childNodes).forEach((node) => mediaDiv.appendChild(node));

  // --- RIGHT COLUMN (text) ---
  // Use card-body if present, else the whole column
  let textSource = cols[1].querySelector('.card-body') || cols[1];
  const textDiv = document.createElement('div');
  Array.from(textSource.childNodes).forEach((node) => textDiv.appendChild(node));

  // Build the block table: header (1 column), content (2 columns)
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns2)'],
    [mediaDiv, textDiv],
  ], document);

  element.replaceWith(table);
}
