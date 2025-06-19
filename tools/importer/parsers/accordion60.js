/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion group section (if present)
  let accordionSection = element.querySelector('section.ct-accordion-group');
  if (!accordionSection) accordionSection = element;

  // We'll collect all rows (header first)
  const rows = [];

  // 1. Header row: only one cell with the block name as per the example
  rows.push(['Accordion (accordion60)']);

  // 2. All following rows are two columns: [title, content]
  const cards = Array.from(accordionSection.querySelectorAll(':scope > .card.mb-1'));

  cards.forEach(card => {
    // Title cell
    let title = '';
    const titleBody = card.querySelector(':scope > .card-body');
    if (titleBody) {
      const btn = titleBody.querySelector('button');
      if (btn) {
        const span = btn.querySelector('span');
        if (span && span.textContent) {
          title = span.textContent.trim();
        } else {
          title = btn.textContent.trim();
        }
      }
    }

    // Content cell (may contain multiple elements)
    let contentFragments = [];
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      // In .collapse, include all .card-body and .card-link (in order)
      const collapseChildren = Array.from(collapse.children);
      collapseChildren.forEach(child => {
        if (child.classList.contains('card-body') || child.classList.contains('card-link')) {
          contentFragments.push(child);
        }
      });
      if (contentFragments.length === 0) contentFragments = [''];
    } else {
      contentFragments = [''];
    }

    rows.push([title, contentFragments.length === 1 ? contentFragments[0] : contentFragments]);
  });

  // Always ensure the header row is a single cell, but subsequent rows are two cells
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
