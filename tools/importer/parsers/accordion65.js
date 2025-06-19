/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Accordion (accordion65)'];

  // Get all accordion items (sections with class 'drawer')
  const accordionSections = element.querySelectorAll(':scope .drawer');
  const rows = [];

  accordionSections.forEach((section) => {
    // Find the title button
    const button = section.querySelector(':scope > button.drawer-face');
    // Find the content
    const body = section.querySelector(':scope > .drawer-body');
    // Edge case: skip if no title or content
    if (!button || !body) return;
    // Reference the existing button and body elements
    rows.push([button, body]);
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
