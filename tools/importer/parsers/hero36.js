/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image element (if present)
  let imageEl = element.querySelector('.card-img img');

  // Extract the card text (if present)
  let textEl = element.querySelector('.card-text');

  // Use the original nodes directly if present, or an empty string otherwise
  const rows = [];

  // 1. Header row: block name (must exactly match 'Hero', no formatting)
  rows.push(['Hero']);
  // 2. Second row: image (background image, optional)
  rows.push([imageEl ? imageEl : '']);
  // 3. Third row: text block (optional)
  rows.push([textEl ? textEl : '']);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
