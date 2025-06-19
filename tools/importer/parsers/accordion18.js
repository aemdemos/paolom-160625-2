/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block
  const headerRow = ['Accordion (accordion18)'];

  // Find the accordion group container (bynder-document-feed)
  const group = element.querySelector('#bynder-document-feed');
  if (!group) return;

  // Find all the <section.drawer> children (each is an accordion item)
  const drawers = group.querySelectorAll(':scope > section.drawer');

  // Construct rows for each drawer: [title, content]
  const rows = Array.from(drawers).map(drawer => {
    // Title cell: button.drawer-face (as referenced element)
    const titleBtn = drawer.querySelector('button.drawer-face');
    let title;
    if (titleBtn) {
      // Use a <p> to match semantic intent, but reference the text directly from button
      const p = document.createElement('p');
      p.textContent = titleBtn.textContent.trim();
      title = p;
    } else {
      title = document.createElement('p');
      title.textContent = '';
    }

    // Content cell: the .drawer-body (reference the existing element)
    const content = drawer.querySelector('.drawer-body');
    return [title, content];
  });

  // Build table data (header + all rows)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);

  return table;
}
