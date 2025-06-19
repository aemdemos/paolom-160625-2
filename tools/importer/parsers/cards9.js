/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers
  const cards = Array.from(element.querySelectorAll('.product-list.grid-view > div'));
  const rows = [['Cards (cards9)']];

  cards.forEach(card => {
    // First cell: the image (reference existing element)
    const img = card.querySelector('img');
    const imgCell = img || '';

    // Second cell: composed content
    const content = [];

    // Title: .card-subtitle > a (as <strong>)
    const subtitleA = card.querySelector('.card-subtitle a');
    if (subtitleA) {
      const strong = document.createElement('strong');
      strong.innerHTML = subtitleA.innerHTML;
      content.push(strong);
    }

    // Subheading: .card-title > a (if different from subtitle), as <p>
    const titleA = card.querySelector('.card-title a');
    if (titleA && (!subtitleA || titleA.textContent.trim() !== subtitleA.textContent.trim())) {
      const p = document.createElement('p');
      p.appendChild(titleA);
      content.push(p);
    }

    // Attributes: .card-text.product-attributes p
    const attribs = card.querySelectorAll('.card-text.product-attributes p');
    attribs.forEach(p => {
      content.push(p);
    });

    // CTAs: .card-footer a
    const actions = Array.from(card.querySelectorAll('.card-footer a'));
    if (actions.length) {
      const ctaDiv = document.createElement('div');
      actions.forEach(a => ctaDiv.appendChild(a));
      content.push(ctaDiv);
    }

    // Push the row if there is at least an image or content
    if (imgCell || content.length) {
      rows.push([imgCell, content]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
