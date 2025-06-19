/* global WebImporter */
export default function parse(element, { document }) {
  // Get the accordion section (works if element is container or the section itself)
  const section = element.querySelector('section.ct-accordion-group') || element;
  const cards = Array.from(section.querySelectorAll(':scope > .card'));

  // Accordion block header
  const rows = [['Accordion (accordion62)']];

  cards.forEach(card => {
    // Get the title from button > span
    let title = '';
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const btn = cardBody.querySelector('button');
      if (btn) {
        const span = btn.querySelector('span');
        if (span) title = span;
      }
    }
    // Get the content(s) from the collapse's left/right columns
    let contentFragments = [];
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      // All .card-body.col-left (the main answer)
      const colLeft = collapse.querySelector('.card-body.col-left');
      if (colLeft) contentFragments.push(colLeft);
      // .card-link.col-right (add if present, eg. a button or external link)
      const colRight = collapse.querySelector('.card-link.col-right');
      if (colRight) contentFragments.push(colRight);
    }
    // Use empty string if nothing found
    if (!title) title = '';
    if (!contentFragments.length) contentFragments = [''];
    rows.push([
      title,
      contentFragments.length === 1 ? contentFragments[0] : contentFragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
