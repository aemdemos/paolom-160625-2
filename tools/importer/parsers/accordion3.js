/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion group container
  const accordionGroup = element.querySelector('.ct-accordion-group');
  if (!accordionGroup) {
    // fallback, just replace element with empty accordion block
    const table = WebImporter.DOMUtils.createTable([
      ['Accordion (accordion3)']
    ], document);
    element.replaceWith(table);
    return;
  }

  // Get all drawer (accordion item) sections directly under the accordion group
  const drawers = Array.from(accordionGroup.querySelectorAll(':scope > section.drawer'));

  const rows = [];
  // Header row: must match exactly the example
  rows.push(['Accordion (accordion3)']);

  drawers.forEach((drawer) => {
    // Title cell: the button (do not clone, use a DIV with its text only for plain text)
    const button = drawer.querySelector(':scope > button.drawer-face');
    let titleCell = '';
    if (button && button.textContent) {
      const div = document.createElement('div');
      div.textContent = button.textContent.trim();
      titleCell = div;
    }

    // Content cell: reference the drawer-body div directly if it exists, otherwise empty string
    const body = drawer.querySelector(':scope > .drawer-body');
    let contentCell = '';
    if (body) {
      // Remove any aria/hidden attributes that are purely scripting-related
      // (shouldn't be visible, but just in case the HTML has collapsed state)
      body.removeAttribute('hidden');
      contentCell = body;
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
