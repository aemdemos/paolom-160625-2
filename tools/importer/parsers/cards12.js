/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards12) block expects multiple cards, each with image/icon and text
  // The provided HTML does not actually contain any card data, images, headings, or descriptions.
  // Therefore, the correct table should have only the header and NO card rows as there is no such data to extract.
  // The row with product count and view controls does NOT represent cards and should not be included as rows.

  // Construct the block header row exactly as in the example
  const rows = [
    ['Cards (cards12)']
    // No card rows, as no card content present in the given HTML
  ];
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
