/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const cells = [['Cards (cards52)']];

  // Each direct child div is a card column
  const cardContainers = element.querySelectorAll(':scope > div');
  cardContainers.forEach(cardCol => {
    const card = cardCol.querySelector('.card');
    if (!card) return;
    // Image cell: reference the existing image element if available
    let imgCell = '';
    const imgDiv = card.querySelector('.card-img');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imgCell = img;
    }
    // Text content cell: title (strong), description, CTA link
    const body = card.querySelector('.card-body');
    const textCell = [];
    if (body) {
      const title = body.querySelector('.card-title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textCell.push(strong);
        textCell.push(document.createElement('br'));
      }
      const desc = body.querySelector('.card-text');
      if (desc) {
        textCell.push(desc);
      }
    }
    // CTA link (if present)
    const footer = card.querySelector('.card-footer');
    if (footer) {
      const link = footer.querySelector('a');
      if (link) {
        textCell.push(document.createElement('br'));
        textCell.push(link);
      }
    }
    // Add the card's row
    cells.push([imgCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
