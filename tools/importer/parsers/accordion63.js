/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec
  const rows = [['Accordion (accordion63)']];

  // Find the accordion section
  const section = element.querySelector('section.ct-accordion-group');
  if (!section) return;

  // Get all accordion cards
  const cards = section.querySelectorAll(':scope > .card');

  cards.forEach(card => {
    // Title extraction: use the original span element inside the button
    let titleCell = '';
    const btn = card.querySelector('.card-body button');
    if (btn) {
      const span = btn.querySelector('span');
      // Use the span element directly if it exists
      if (span) {
        titleCell = span;
      } else {
        // If not, fallback to button text (should rarely occur)
        titleCell = document.createTextNode(btn.textContent.trim());
      }
    }

    // Content extraction: use the .col-left element or its children
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const colLeft = collapse.querySelector('.col-left');
      if (colLeft) {
        // If .col-left has multiple nodes, include all. If just one, use the element directly.
        if (colLeft.childNodes.length === 1) {
          contentCell = colLeft.firstChild;
        } else {
          // Use array of nodes to preserve all children (including text, links, etc)
          contentCell = Array.from(colLeft.childNodes);
        }
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
