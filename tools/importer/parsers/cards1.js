/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid of cards containing all products
  const cardContainer = element.querySelector('.productlist .product-list.grid-view');
  if (!cardContainer) return;
  const cardCols = Array.from(cardContainer.querySelectorAll(':scope > div'));
  const rows = [];
  rows.push(['Cards (cards1)']); // header row exactly as specified

  cardCols.forEach(cardCol => {
    const card = cardCol.querySelector('.card.h-100');
    if (!card) return;

    // Extract image (first img inside first a)
    let img = null;
    const imgLink = card.querySelector('a[aria-label="Product-details"]');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // Build text content
    const textContent = document.createElement('div');

    // --- Title (model name, red, is .card-subtitle > a), then type (black, is .card-title > a) ---
    const model = card.querySelector('.card-subtitle a');
    if (model) {
      const strong = document.createElement('strong');
      strong.textContent = model.textContent.trim();
      textContent.appendChild(strong);
      textContent.appendChild(document.createElement('br'));
    }
    const type = card.querySelector('.card-title a');
    if (type) {
      const typeDiv = document.createElement('div');
      typeDiv.textContent = type.textContent.trim();
      textContent.appendChild(typeDiv);
    }

    // --- Product attributes (kW ranges, in .product-attributes) ---
    const attrBlock = card.querySelector('.card-text.product-attributes');
    if (attrBlock) {
      // Use only the <p> children, ignore input, .item, etc.
      Array.from(attrBlock.querySelectorAll('p')).forEach(p => {
        const pCopy = document.createElement('div');
        pCopy.innerHTML = p.innerHTML;
        textContent.appendChild(pCopy);
      });
    }

    // --- CTAs (Dokumente, Details) from .card-footer ---
    const footer = card.querySelector('.card-footer');
    if (footer) {
      const ctas = Array.from(footer.querySelectorAll('a'));
      if (ctas.length) {
        textContent.appendChild(document.createElement('br'));
        ctas.forEach((cta, idx) => {
          if (idx > 0) textContent.appendChild(document.createElement('br'));
          textContent.appendChild(cta);
        });
      }
    }

    // Compose row: always two cells
    rows.push([
      img || '',
      textContent,
    ]);
  });
  
  // Replace original with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
