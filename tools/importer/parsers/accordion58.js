/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: always one column, text matches exactly
  const rows = [['Accordion (accordion58)']];
  // Find all accordion items (drawers)
  // Accept both 'section.drawer', '.drawer', but exclude container class
  let drawerSections = Array.from(element.querySelectorAll('section.drawer'));
  // Sometimes there is only one .drawer (not section), so handle fallback
  if (drawerSections.length === 0) {
    // Only select .drawer elements that are not the container
    drawerSections = Array.from(element.querySelectorAll('.drawer'))
      .filter(node => node.tagName !== 'DIV' || !node.classList.contains('ct-accordion-group'));
  }
  // For each drawer/accordion item
  drawerSections.forEach(section => {
    // Title: button.drawer-face or fallback
    let titleBtn = section.querySelector('button.drawer-face') || section.querySelector('button') || section.querySelector('h2, h3, h4, h1');
    let titleCell = '';
    if (titleBtn) {
      // Remove SVGs from button for clean text
      titleBtn.querySelectorAll('svg').forEach(svg => svg.remove());
      titleCell = titleBtn.textContent.trim();
    }
    // Content: drawer-body or all children except the button
    let contentCell = '';
    let body = section.querySelector('div.drawer-body');
    if (body) {
      contentCell = body;
    } else {
      // fallback: all children except titleBtn
      const contentNodes = Array.from(section.children).filter(child => child !== titleBtn);
      if (contentNodes.length === 1) contentCell = contentNodes[0];
      else if (contentNodes.length > 1) contentCell = contentNodes;
    }
    if (titleCell) rows.push([titleCell, contentCell]);
  });
  // Replace the element with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
