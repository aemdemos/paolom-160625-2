/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block header - must match example exactly
  const headerRow = ['Carousel (carousel31)'];

  // Get the indicators container holding the slide thumbnails
  const indicators = element.querySelector('.carousel-indicators.thumbnail-list');
  // Fallback: if no indicators, no slides
  const slides = indicators ? Array.from(indicators.querySelectorAll(':scope > .thumbnail-item')) : [];

  // Assemble table rows for each slide
  const rows = slides.map((slide) => {
    // Find the image inside the slide
    const img = slide.querySelector('img');
    // Try to find text content (none in the given HTMLs, but generalize for future cases)
    let textContent = '';
    // Try to generalize: checks for title/desc/cta if present
    // (future extension: add selectors here)
    
    // If there is text content, add as second cell; else, only image in row
    if (textContent && textContent.trim() !== '') {
      return [img, textContent];
    }
    return [img];
  });

  // Compose table: header row, then slide rows
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
