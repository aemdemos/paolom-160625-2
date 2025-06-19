/* global WebImporter */
export default function parse(element, { document }) {
  // The footer HTML contains only legal links and copyright.
  // According to the markdown, for empty hero blocks (no image, no headline),
  // the table should have three rows with the header 'Hero', and empty strings for the other two.
  // There is no Section Metadata block in the example.
  // There are no images or headings in the supplied HTML, so both content rows are empty.
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [''],
    [''],
  ], document);
  element.replaceWith(table);
}
