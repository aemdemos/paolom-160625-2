/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block header
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];
  
  // Find the section with the product cards
  const section = element.querySelector('section#product-view');
  if (section) {
    // Find all card columns inside the product list
    const cards = section.querySelectorAll('.row.product-list.grid-view > .item-start');
    cards.forEach(card => {
      // --- Image cell ---
      let image = card.querySelector('img');
      // --- Text content cell ---
      const cardBody = card.querySelector('.card-body');
      const textCell = document.createElement('div');
      if (cardBody) {
        // Subtitle (product name, usually in uppercase, red)
        let subtitleEl = cardBody.querySelector('.card-subtitle a, .card-subtitle');
        if (subtitleEl) {
          // Reference the actual element, not a clone
          textCell.appendChild(subtitleEl);
          textCell.appendChild(document.createElement('br'));
        }
        // Title (below, in black, regular)
        let titleEl = cardBody.querySelector('.card-title a, .card-title');
        if (titleEl) {
          textCell.appendChild(titleEl);
          textCell.appendChild(document.createElement('br'));
        }
      }
      // --- CTAs ---
      const cardFooter = card.querySelector('.card-footer');
      if (cardFooter) {
        // One button per line, following the markup order
        cardFooter.querySelectorAll('a').forEach(link => {
          textCell.appendChild(link);
          textCell.appendChild(document.createElement('br'));
        });
      }
      // Clean up any trailing <br>
      while(textCell.lastChild && textCell.lastChild.tagName === 'BR') {
        textCell.removeChild(textCell.lastChild);
      }
      // Push row: [image, textCell]
      rows.push([image, textCell]);
    });
  }
  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
