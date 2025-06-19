/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match exactly
  const headerRow = ['Cards (cards49)'];

  // Find all cards
  const cardCols = Array.from(element.querySelectorAll('.card-container'));

  // For each card, extract image, title, and CTA
  const rows = cardCols.map(cardCol => {
    const card = cardCol.querySelector('.card');
    if (!card) return null;
    // Image cell
    let imgEl = card.querySelector('.card-img img');
    // Text content cell (title + CTA)
    const content = [];
    // Title
    const titleDiv = card.querySelector('.card-title');
    if (titleDiv && titleDiv.textContent.trim()) {
      // Use a <strong> for visual emphasis, consistent with example (no Hx used in the source)
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      content.push(strong);
    }
    // No description in this HTML to extract
    // CTA (optional)
    const ctaLink = card.querySelector('.card-footer a');
    if (ctaLink) {
      content.push(document.createElement('br'));
      content.push(ctaLink);
    }
    return [imgEl, content];
  }).filter(Boolean);

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
