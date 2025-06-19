/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as per the example (no formatting)
  const headerRow = ['Hero'];

  // Find the first carousel-item (active) as the Hero
  const firstItem = element.querySelector('.carousel-item');
  let image = '';
  let contentParts = [];

  if (firstItem) {
    // Get image
    const imgWrap = firstItem.querySelector('.card-img img');
    if (imgWrap) {
      image = imgWrap;
    }

    // Get title (as heading)
    const titleLink = firstItem.querySelector('.card-title a');
    if (titleLink) {
      // Reference anchor directly, and wrap in heading element for semantics
      const h1 = document.createElement('h1');
      // Use only the contents of the anchor
      while (titleLink.firstChild) {
        h1.appendChild(titleLink.firstChild);
      }
      contentParts.push(h1);
    }

    // Get description/subheading
    const desc = firstItem.querySelector('.card-text');
    if (desc && desc.textContent.trim()) {
      contentParts.push(desc);
    }
  }

  // Table: header, image row, content row
  const cells = [
    headerRow,
    [image],
    [contentParts.length ? contentParts : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
