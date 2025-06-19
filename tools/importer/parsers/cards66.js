/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match: 'Cards (cards66)'
  const headerRow = ['Cards (cards66)'];
  const rows = [headerRow];
  // Find the grid of cards
  const productList = element.querySelector('.product-list.grid-view');
  if (!productList) return;
  // Each card is a direct child div with .item-start
  const cards = productList.querySelectorAll(':scope > div.item-start');
  cards.forEach(cardEl => {
    // Column 1: Image (reference the existing img element)
    let image = null;
    const imgAnchor = cardEl.querySelector('a');
    if (imgAnchor) {
      image = imgAnchor.querySelector('img');
    }
    // Column 2: Text content (model as heading, description, CTAs)
    const cardBody = cardEl.querySelector('.card-body');
    const textCell = document.createElement('div');
    // Model (subtitle) as bold or heading-like
    let subtitle = '';
    const subtitleDiv = cardBody?.querySelector('.card-subtitle');
    if (subtitleDiv && subtitleDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = subtitleDiv.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    // Title/Description (card-title)
    const titleDiv = cardBody?.querySelector('.card-title');
    if (titleDiv && titleDiv.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = titleDiv.textContent.trim();
      textCell.appendChild(span);
      textCell.appendChild(document.createElement('br'));
    }
    // CTAs from card-footer
    const cardFooter = cardEl.querySelector('.card-footer');
    if (cardFooter) {
      // Reference the actual anchor elements (do not clone)
      const links = Array.from(cardFooter.querySelectorAll('a'));
      links.forEach((a, idx) => {
        textCell.appendChild(a);
        if (idx < links.length - 1) {
          textCell.appendChild(document.createTextNode(' '));
        }
      });
    }
    // Remove trailing <br> if present
    if (textCell.lastChild && textCell.lastChild.nodeName === 'BR') {
      textCell.removeChild(textCell.lastChild);
    }
    rows.push([image, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
