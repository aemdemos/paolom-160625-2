/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main product cards container
  const cardsSection = element.querySelector('section#product-view');
  if (!cardsSection) return;

  const cardsRow = cardsSection.querySelector('.row.product-list.grid-view');
  if (!cardsRow) return;
  const cardCols = Array.from(cardsRow.children).filter(col => col.classList.contains('item-start'));

  const rows = [['Cards (cards46)']];

  cardCols.forEach(cardCol => {
    const card = cardCol.querySelector('.card');
    if (!card) return;

    // -------- IMAGE CELL --------
    let imgEl = card.querySelector('img.card-img-top');

    // -------- TEXT CELL --------
    const textCell = document.createElement('div');
    // Title (subtitle, then title)
    const productTitles = card.querySelector('.product-titles');
    if (productTitles) {
      const subtitle = productTitles.querySelector('.card-subtitle');
      if (subtitle && subtitle.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = subtitle.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
      }
      const title = productTitles.querySelector('.card-title');
      if (title && title.textContent.trim()) {
        textCell.appendChild(document.createTextNode(title.textContent.trim()));
        textCell.appendChild(document.createElement('br'));
      }
    }
    // Product attributes (description)
    const attributes = card.querySelector('.card-text.product-attributes');
    if (attributes) {
      // Use only the direct child <p> elements (not <input/hidden> etc)
      Array.from(attributes.children).forEach(child => {
        if (child.tagName === 'P') {
          // Each p as a paragraph
          const p = document.createElement('p');
          p.innerHTML = child.innerHTML; // preserve structure
          textCell.appendChild(p);
        }
      });
    }
    // CTAs (Details, Dokumente)
    const footer = card.querySelector('.card-footer');
    if (footer) {
      const ctaLinks = Array.from(footer.querySelectorAll('a')).filter(a => a.textContent.trim());
      if (ctaLinks.length > 0) {
        const ctaDiv = document.createElement('div');
        ctaLinks.forEach((a, idx) => {
          // Reference the existing element
          ctaDiv.appendChild(a);
          // Add space except after the last
          if (idx < ctaLinks.length-1) {
            ctaDiv.appendChild(document.createTextNode(' '));
          }
        });
        textCell.appendChild(ctaDiv);
      }
    }
    rows.push([
      imgEl,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
