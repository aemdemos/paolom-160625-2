/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion16)'];

  // Find the accordion group container (by class or structure)
  // The element is the outermost div, so get the child .ct-accordion-group
  const group = element.querySelector('.ct-accordion-group');
  if (!group) return;

  // Each accordion item is a section.drawer
  const drawers = group.querySelectorAll('.drawer');

  // Prepare the rows array, starting with the header row
  const rows = [headerRow];

  drawers.forEach((drawer) => {
    // Title: the button.drawer-face (accordion title)
    const titleButton = drawer.querySelector('.drawer-face');
    // Content: the .drawer-body (accordion content)
    const body = drawer.querySelector('.drawer-body');

    // Defensive: ensure both exist
    if (!titleButton || !body) return;

    // Use the title button as-is (do not clone)
    // Use the drawer-body as-is (do not clone)
    rows.push([titleButton, body]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
