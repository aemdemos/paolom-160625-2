/* global WebImporter */
export default function parse(element, { document }) {
  // The table header as specified by the block
  const rows = [['Accordion (accordion67)']];

  // Find all direct accordion sections
  const sections = element.querySelectorAll(':scope .drawer');
  sections.forEach(section => {
    // Title: extract from the button.drawer-face
    const button = section.querySelector('.drawer-face');
    let titleContent;
    if (button) {
      // Reference a <p> containing the text
      const titleP = document.createElement('p');
      titleP.textContent = button.textContent.trim();
      titleContent = titleP;
    } else {
      titleContent = '';
    }
    // Content: everything inside .drawer-body (including forms, lists, etc.)
    const body = section.querySelector('.drawer-body');
    let contentCell;
    if (body) {
      // Remove any .drawer-face that might have been incorrectly placed inside drawer-body
      body.querySelectorAll('.drawer-face').forEach(f => f.remove());
      contentCell = body;
    } else {
      contentCell = '';
    }
    rows.push([titleContent, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
