/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the accordion cards.
  const section = element.querySelector('section.ct-accordion-group') || element;
  // Get all direct children with class 'card'
  const cards = Array.from(section.querySelectorAll(':scope > .card'));

  // Header row - must match exactly as per requirements.
  const rows = [['Accordion (accordion22)']];

  cards.forEach(card => {
    // Title cell: find button > span inside the first .card-body
    let titleText = '';
    const firstCardBody = card.querySelector(':scope > .card-body');
    if (firstCardBody) {
      const btn = firstCardBody.querySelector('button');
      if (btn) {
        const span = btn.querySelector('span');
        if (span) {
          titleText = span.textContent.trim();
        } else {
          titleText = btn.textContent.trim();
        }
      } else {
        titleText = firstCardBody.textContent.trim();
      }
    }
    // Create a text node for the title cell to preserve formatting
    const titleCell = document.createTextNode(titleText);

    // Content cell: gather all direct children of collapse div
    let contentCell;
    const collapse = card.querySelector('div.collapse');
    if (collapse) {
      // Only include children that have content or meaningful elements
      const contentParts = Array.from(collapse.children).filter(child => {
        // At least some text or at least one <a>, <img>, or <iframe>
        return child.textContent.trim() || child.querySelector('a, img, iframe');
      });
      if (contentParts.length === 1) {
        contentCell = contentParts[0];
      } else if (contentParts.length > 1) {
        contentCell = contentParts;
      } else {
        // If no child parts, cell is empty
        contentCell = document.createTextNode('');
      }
    } else {
      // If no collapse panel, cell is empty
      contentCell = document.createTextNode('');
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
