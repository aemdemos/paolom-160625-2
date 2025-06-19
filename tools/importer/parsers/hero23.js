/* global WebImporter */
export default function parse(element, { document }) {
  // According to the example, this Hero block is:
  // 1 col, 3 rows: [Header], [Image (optional)], [Heading, text, cta]
  // The header row must be: 'Hero'

  // 1. Header row (exact match to example)
  const headerRow = ['Hero'];

  // 2. Image row: the source HTML does not have an image, so this row is blank
  // (If an image existed, we'd put the reference here)
  const imageRow = [''];

  // 3. Content row: Heading, Text, CTA
  // Only the first visible tab-pane is shown in the screenshot, so extract only the first (active) one
  const activePane = element.querySelector('.tab-pane.active') || element.querySelector('.tab-pane');
  let contentElements = [];
  if (activePane) {
    const cardBody = activePane.querySelector('.card-body');
    if (cardBody) {
      // Extract card-title as <h1>
      const cardTitle = cardBody.querySelector('.card-title');
      if (cardTitle && cardTitle.textContent.trim()) {
        const h1 = document.createElement('h1');
        h1.innerHTML = cardTitle.innerHTML;
        contentElements.push(h1);
      }
      // card-text div (paragraph)
      const cardText = cardBody.querySelector('.card-text');
      if (cardText && cardText.textContent.trim()) {
        contentElements.push(cardText);
      }
      // CTA link (if present)
      const cardLink = cardBody.querySelector('.card-link a');
      if (cardLink) {
        contentElements.push(cardLink);
      }
    }
  }
  // Make sure contentElements is never empty, as in some Hero blocks content may be missing
  const contentRow = [contentElements.length ? contentElements : ['']];

  // Compose the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // There is no Section Metadata block in this example, so we do NOT add <hr> or a metadata table.

  // Replace the original element with the new block table
  element.replaceWith(table);
}
