/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block name, must match the required block name
  const headerRow = ['Accordion (accordion51)'];

  // Find the accordion group section
  const section = element.querySelector('section.ct-accordion-group');
  if (!section) return;

  // Get all accordion items (cards)
  const cards = section.querySelectorAll(':scope > .card.mb-1');

  const rows = [headerRow];

  cards.forEach(card => {
    // Get the title, which is inside the card-body > button > span
    let titleElem = null;
    const titleBody = card.querySelector(':scope > .card-body');
    if (titleBody) {
      const btn = titleBody.querySelector('button');
      if (btn) {
        const span = btn.querySelector('span');
        if (span) {
          titleElem = span;
        } else {
          // fallback to button if span is missing
          titleElem = btn;
        }
      }
    }
    // Get the content, which is inside .collapse > .card-body.col-left
    let contentElem = null;
    const collapse = card.querySelector(':scope > div.collapse');
    if (collapse) {
      const contentBody = collapse.querySelector(':scope > .card-body.col-left');
      if (contentBody) {
        contentElem = contentBody;
      }
    }
    // Always push two columns (even if null, to match structure)
    rows.push([titleElem, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
