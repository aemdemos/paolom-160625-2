/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <section class="ct-accordion-group"> within element
  const section = element.querySelector('section.ct-accordion-group');
  if (!section) return;
  
  // Setup header for the accordion block (now with two columns)
  const headerRow = ['Accordion (accordion10)', ''];
  const rows = [headerRow];

  // Each .card is an accordion item
  const cards = section.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title: .card-body > button > span (first .card-body is for the button)
    let title = '';
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const button = cardBody.querySelector('button');
      if (button) {
        const span = button.querySelector('span');
        if (span) {
          title = span.textContent.trim();
        }
      }
    }
    // Content: collect all direct children of .collapse (skip empty)
    let contentCell;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      let contentDivs = Array.from(collapse.children).filter(
        (child) => child.textContent.trim().length > 0
      );
      // If both left and right (e.g. download link), keep both in cell
      if (contentDivs.length > 1) {
        contentCell = contentDivs; // grab all, e.g. text and download link
      } else if (contentDivs.length === 1) {
        contentCell = contentDivs[0];
      } else {
        contentCell = document.createTextNode('');
      }
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([title, contentCell]);
  });
  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the new table
  element.replaceWith(table);
}
