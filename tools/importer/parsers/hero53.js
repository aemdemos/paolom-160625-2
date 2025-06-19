/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first carousel-item (the first 'slide')
  const firstItem = element.querySelector('.carousel-item');
  if (!firstItem) return;
  const cardBody = firstItem.querySelector('.card-body');
  if (!cardBody) return;

  // Get the image (background image for hero)
  let img = null;
  const cardImg = cardBody.querySelector('.card-img img');
  if (cardImg) {
    img = cardImg;
  }

  // Get the heading (from the card-title link)
  let heading = null;
  const cardTitle = cardBody.querySelector('.card-title');
  if (cardTitle) {
    const link = cardTitle.querySelector('a');
    if (link) {
      heading = document.createElement('h1');
      heading.innerHTML = link.innerHTML; // preserves <sup> etc
    }
  }

  // Get the subheading/description (from the card-text, if present)
  let desc = null;
  const cardText = cardBody.querySelector('.card-text');
  if (cardText && cardText.textContent.trim()) {
    desc = document.createElement('p');
    desc.textContent = cardText.textContent.trim();
  }

  // Compose content cell (heading, desc)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (desc) contentCell.push(desc);

  // Compose table as per example: 1 column, 3 rows, header = 'Hero'
  const cells = [
    ['Hero'],
    [img || ''],
    [contentCell.length ? contentCell : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
