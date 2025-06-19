/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example
  const headerRow = ['Carousel (carousel20)'];

  // Find all slides (direct children with class 'carousel-item')
  const slides = element.querySelectorAll(':scope > .carousel-item');

  const rows = [headerRow];

  slides.forEach((slide) => {
    // Get first image in .card-img
    let imageEl = null;
    const cardImg = slide.querySelector('.card-img');
    if (cardImg) {
      imageEl = cardImg.querySelector('img');
    }
    // Get the entire node of .card-text (may include HTML formatting)
    let textEl = '';
    const cardText = slide.querySelector('.card-text');
    if (cardText) {
      textEl = cardText;
    }
    // Only push rows with at least image or text
    if (imageEl || textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
