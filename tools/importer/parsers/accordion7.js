/* global WebImporter */
export default function parse(element, { document }) {
  // Compose block rows for Accordion (accordion7)
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // The accordion sections are <section class="drawer">
  const sections = element.querySelectorAll('section.drawer');

  sections.forEach((section) => {
    // Title: use the text of the button.drawer-face
    let titleCell = '';
    const button = section.querySelector('button.drawer-face');
    if (button) {
      titleCell = button.textContent.trim();
    }
    // Content: reference the full .drawer-body node (not cloning)
    const body = section.querySelector('div.drawer-body');
    let contentCell = null;
    if (body) {
      contentCell = body;
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}