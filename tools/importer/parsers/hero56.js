/* global WebImporter */
export default function parse(element, { document }) {
  // Get the first carousel-item (active, or first)
  const firstItem = element.querySelector('.carousel-item');
  if (!firstItem) {
    // fallback: nothing found
    return;
  }
  // Find card-body
  const cardBody = firstItem.querySelector('.card-body');
  if (!cardBody) return;

  // Get image element (if any)
  let imgEl = null;
  const cardImgDiv = cardBody.querySelector('.card-img');
  if (cardImgDiv) {
    imgEl = cardImgDiv.querySelector('img');
  }

  // Get the title/link
  let headingEl = null;
  const cardTitleDiv = cardBody.querySelector('.card-title');
  if (cardTitleDiv) {
    const link = cardTitleDiv.querySelector('a');
    if (link) {
      headingEl = document.createElement('h1');
      // Use the innerHTML to preserve any HTML formatting, such as <sup>
      headingEl.innerHTML = link.innerHTML;
    }
  }

  // Get description text (may contain <p> or just text)
  const cardTextDiv = cardBody.querySelector('.card-text');
  let descriptionNodes = [];
  if (cardTextDiv) {
    if (cardTextDiv.children.length > 0) {
      // Use all children (e.g., <p>s)
      descriptionNodes = Array.from(cardTextDiv.children);
    } else if (cardTextDiv.textContent.trim()) {
      // Text only, wrap in <p>
      const p = document.createElement('p');
      p.textContent = cardTextDiv.textContent.trim();
      descriptionNodes = [p];
    } // else, nothing
  }

  // Compose the text cell: heading (if exists) + description(s)
  const textCellContent = [];
  if (headingEl) textCellContent.push(headingEl);
  if (descriptionNodes && descriptionNodes.length > 0) {
    textCellContent.push(...descriptionNodes);
  }

  // Always create 3 rows: header, image, text
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [textCellContent.length > 0 ? textCellContent : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
