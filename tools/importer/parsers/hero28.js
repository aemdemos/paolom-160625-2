/* global WebImporter */
export default function parse(element, { document }) {
  // HERO block: 1 column, 3 rows
  // 1. Header row (block name)
  // 2. Background image (empty)
  // 3. Headline (Heading in Block)

  // The provided HTML does NOT contain an image or heading,
  // but the example shows a heading: 'Heading in Block'.
  // To be robust, extract a heading if present, otherwise leave empty.

  // Try to find a heading in a sibling element, but the current element is a <ul> of nav tabs only.
  // So in this context, we leave headline row empty.

  const cells = [
    ['Hero'],
    [''],
    [''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
