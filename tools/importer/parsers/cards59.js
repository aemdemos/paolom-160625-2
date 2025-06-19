/* global WebImporter */
export default function parse(element, { document }) {
  // Get the cards group container
  const cardsGroup = element.querySelector('.card-container-group');
  if (!cardsGroup) return;

  // Get all card containers (each is a col-... card-container)
  const cardContainers = Array.from(cardsGroup.querySelectorAll(':scope > div'));

  // Table header as required
  const rows = [
    ['Cards (cards59)']
  ];

  cardContainers.forEach(cardCol => {
    // Each 'cardCol' contains one card
    const card = cardCol.querySelector('.card');
    if (!card) return;
    // ---- Image cell ----
    const imgDiv = card.querySelector('.card-img');
    let imgEl = null;
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }
    // ---- Text & CTA cell ----
    const cellContent = [];
    // Title (always present)
    const titleDiv = card.querySelector('.card-title');
    if (titleDiv) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      cellContent.push(strong);
    }
    // Spacer for visual separation
    if (cellContent.length > 0) {
      cellContent.push(document.createElement('br'));
    }
    // CTA (button link)
    const cta = card.querySelector('.card-footer a');
    if (cta) {
      // reference the actual anchor element (no cloning)
      // Remove child <i> if present (icon)
      const icon = cta.querySelector('i');
      if (icon) icon.remove();
      // The CTA is just the anchor, with its text content
      cellContent.push(cta);
    }
    rows.push([
      imgEl,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
