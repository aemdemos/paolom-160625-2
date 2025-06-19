/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main column divs: left (image), right (text)
  const row = element.querySelector('.row');
  let leftCol = null;
  let rightCol = null;
  if (row) {
    const children = row.querySelectorAll(':scope > div');
    children.forEach((div) => {
      if (div.classList.contains('col-left')) {
        leftCol = div;
      } else if (div.classList.contains('col-right')) {
        rightCol = div;
      }
    });
  }
  // Extract image from leftCol
  let imageCell = '';
  if (leftCol) {
    const img = leftCol.querySelector('img');
    if (img) imageCell = img;
  }
  // Extract title and list from rightCol
  let textCell = '';
  if (rightCol) {
    const cardBody = rightCol.querySelector('.card-body');
    if (cardBody) {
      // Compose contents: h2 + ul (if present)
      const frag = document.createDocumentFragment();
      const h2 = cardBody.querySelector('h2');
      if (h2) frag.appendChild(h2);
      const ul = cardBody.querySelector('ul');
      if (ul) frag.appendChild(ul);
      textCell = frag;
    }
  }
  // Compose table block
  const headerRow = ['Columns (columns8)'];
  const contentRow = [textCell, imageCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
