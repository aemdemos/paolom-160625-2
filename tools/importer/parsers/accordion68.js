/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, first is the block name, then each section = row
  const headerRow = ['Accordion (accordion68)'];
  const rows = [headerRow];

  // Find all top-level accordion sections (drawers)
  const sections = element.querySelectorAll('section.drawer');
  sections.forEach((section) => {
    // Title: button.drawer-face (keep as element)
    const btn = section.querySelector('button.drawer-face');
    // Content: div.drawer-body (keep as element)
    const body = section.querySelector('div.drawer-body');
    // Only add rows if both title and content exist
    if (btn && body) {
      rows.push([btn, body]);
    }
  });

  // Create & replace with accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
