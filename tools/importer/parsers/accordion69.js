/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example: exact block name
  const headerRow = ['Accordion (accordion69)'];

  // Find the main accordion group container (support possible variations)
  const group = element.querySelector('.ct-accordion-group') || element;
  
  // Find all accordion sections (drawers)
  const drawers = group.querySelectorAll(':scope > section.drawer');

  const rows = [headerRow];

  drawers.forEach((drawer) => {
    // Title (first cell)
    let titleCell;
    const btn = drawer.querySelector('.drawer-face');
    if (btn) {
      // Use a div with the same text to avoid using a button element
      const div = document.createElement('div');
      div.textContent = btn.textContent.trim();
      titleCell = div;
    } else {
      titleCell = '';
    }
    // Content (second cell) - Use all children of .drawer-body
    let contentCell;
    const body = drawer.querySelector('.drawer-body');
    if (body) {
      // Instead of using Node.TEXT_NODE, use nodeName === '#text'
      const nodes = Array.from(body.childNodes).filter(n => {
        return !(n.nodeName === '#text' && n.textContent.trim() === '');
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else {
        contentCell = nodes;
      }
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
