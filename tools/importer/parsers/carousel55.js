/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row for the carousel block
  const headerRow = ['Carousel (carousel55)'];
  const rows = [headerRow];
  // Collect all direct carousel-item children
  const items = element.querySelectorAll(':scope > .carousel-item, :scope > .carousel-item.active');
  items.forEach((item) => {
    // In each carousel-item, find .card-body
    const cardBody = item.querySelector('.card-body');
    if (!cardBody) return;
    // Get image (first cell)
    const imgDiv = cardBody.querySelector('.card-img');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Get title as heading (second cell, first)
    let heading = null;
    const cardTitleDiv = cardBody.querySelector('.card-title');
    if (cardTitleDiv) {
      // Use the anchor element as is, but wrap in heading tag preserving child nodes
      const a = cardTitleDiv.querySelector('a');
      if (a) {
        heading = document.createElement('h3');
        while (a.firstChild) {
          heading.appendChild(a.firstChild);
        }
      }
    }
    // Get description text (second cell, below heading)
    const cardTextDiv = cardBody.querySelector('.card-text');
    let description = null;
    if (cardTextDiv && cardTextDiv.textContent.trim() !== '') {
      // Use the descriptor div as a <p> for semantic meaning
      description = document.createElement('p');
      description.textContent = cardTextDiv.textContent.trim();
    }
    // Compose right cell
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    // Add the row: image in first cell, content array in second cell
    rows.push([
      img,
      contentCell.length === 1 ? contentCell[0] : contentCell
    ]);
  });
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
