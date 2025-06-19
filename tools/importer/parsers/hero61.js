/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the background image: prefer desktop image, fallback to mobile or first image
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    // Prefer desktop image if present
    bgImg = Array.from(imgs).find(img => img.classList.contains('d-none') && img.classList.contains('d-md-block')) || imgs[0];
  }

  // 2. Extract title and subheading/paragraph
  let title = null;
  let textBlock = null;
  const colRight = element.querySelector('.col-right');
  if (colRight) {
    const cardTitle = colRight.querySelector('.card-title h2');
    if (cardTitle) title = cardTitle;
    const cardText = colRight.querySelector('.card-text');
    if (cardText) textBlock = cardText;
  }

  // Compose content cell: include both title and text if both exist
  let contentCell;
  if (title && textBlock) {
    // Keep semantic (block/h2 then paragraph)
    const frag = document.createElement('div');
    frag.appendChild(title);
    frag.appendChild(document.createElement('br'));
    frag.appendChild(textBlock);
    contentCell = frag;
  } else if (title) {
    contentCell = title;
  } else if (textBlock) {
    contentCell = textBlock;
  } else {
    contentCell = '';
  }

  // 3. Build block table as per example: header row, background image row, content row
  const cells = [
    ['Hero'],
    [bgImg || ''],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
