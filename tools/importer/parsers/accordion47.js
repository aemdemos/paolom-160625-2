/* global WebImporter */
export default function parse(element, { document }) {
  // Component/block name as header
  const headerRow = ['Accordion (accordion47)'];
  const rows = [];

  // Find all accordion sections (each <section class="drawer">)
  // These are direct children of the .ct-accordion-group
  // Use querySelectorAll(':scope > div > section.drawer') to be robust
  const group = element.querySelector('.ct-accordion-group');
  if (!group) return;
  const sections = group.querySelectorAll(':scope > section.drawer');

  sections.forEach((section) => {
    // Title: from <button class="drawer-face">
    let titleCell = '';
    const button = section.querySelector('.drawer-face');
    if (button) {
      // Use a <strong> for the title as visual cue, but same DOM structure
      const strong = document.createElement('strong');
      strong.textContent = button.textContent.trim();
      titleCell = strong;
    }
    // Content: from <div class="drawer-body"> (can contain lists and other markup)
    let contentCell = '';
    const body = section.querySelector('.drawer-body');
    if (body) {
      // Exclude filter forms and buttons (not document content)
      // Rather than clone, remove filter elements from the existing node if possible
      // Don't mutate the original DOM! Use references to existing DOM elements only
      // We'll reference the drawer-body div, but remove filter UI by finding actual content
      // If body contains a UL, use that as the content; else, use the body itself
      const ul = body.querySelector('ul.drawer-document-list');
      if (ul) {
        contentCell = ul;
      } else {
        // Remove <form> elements from body if present
        const children = Array.from(body.children).filter(
          child => child.tagName !== 'FORM'
        );
        // If nothing left, leave as empty. If only one child, use it. Else, use all children.
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // If body has text, use as fallback
          contentCell = body.textContent.trim();
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
