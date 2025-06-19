/* global WebImporter */
export default function parse(element, { document }) {
  // Fix: Header row must match exactly 'Search' as in the example
  const headerRow = ['Search'];

  // The data row is the sample query index URL as per block description
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const a = document.createElement('a');
  a.href = queryIndexUrl;
  a.textContent = queryIndexUrl;
  const contentRow = [a];

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
