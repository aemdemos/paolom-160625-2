/* global WebImporter */
export default function parse(element, { document }) {
  // Get the block name exactly as specified
  const headerRow = ['Columns (columns41)'];

  // Find the left and right column content
  // The main row containing both columns
  const mainRow = element.querySelector('.row');
  let leftCol, rightCol;
  if (mainRow) {
    // The two main columns are children of .card-body, but that is the only .row in the block
    const cardBody = mainRow.querySelector('.card-body');
    if (cardBody) {
      const cols = cardBody.querySelectorAll(':scope > div');
      leftCol = cols[0];
      rightCol = cols[1];
    }
  }
  // Fallback: try to get columns directly
  if (!leftCol || !rightCol) {
    const cols = element.querySelectorAll('[class*=col-sm-]');
    leftCol = cols[0];
    rightCol = cols[1];
  }

  // Defensive: if still missing columns, set empty spans
  if (!leftCol) leftCol = document.createElement('span');
  if (!rightCol) rightCol = document.createElement('span');

  // The rightCol has a nested .row, inside which are the buttons
  // We want to include only the content inside the .col-sm-12.pb-2 (holds the buttons),
  // not the wrapping .row, to avoid extra divs
  let rightContent = rightCol;
  const innerRow = rightCol.querySelector(':scope > .row');
  if (innerRow) {
    const actions = innerRow.querySelector(':scope > .col-sm-12');
    if (actions) rightContent = actions;
    else rightContent = innerRow;
  }

  // Table with two columns, as per the example
  const tableRows = [
    headerRow,
    [leftCol, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
