/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper div
  const accordionRoot = element.querySelector('.ct-accordion-group');
  if (!accordionRoot) return;

  const sections = accordionRoot.querySelectorAll(':scope > section.drawer');
  const rows = [];
  rows.push(['Accordion (accordion11)']);

  sections.forEach((section) => {
    // Accordion title
    const button = section.querySelector('.drawer-face');
    const body = section.querySelector('.drawer-body');
    if (!button || !body) return;
    const titleText = button.textContent.trim();

    // Gather ONLY elements that are NOT <form> inside drawer-body
    const contentElements = [];
    Array.from(body.childNodes).forEach((node) => {
      if (node.nodeType === 1) { // Element
        if (node.tagName.toLowerCase() !== 'form') {
          contentElements.push(node);
        }
      } else if (node.nodeType === 3) { // Text
        if (node.textContent && node.textContent.trim().length > 0) {
          contentElements.push(node);
        }
      }
    });
    rows.push([
      titleText,
      contentElements.length > 0 ? contentElements : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
