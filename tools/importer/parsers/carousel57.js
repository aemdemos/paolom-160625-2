/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must span 2 columns, so headerRow is an array with a single string
  const headerRow = ['Carousel (carousel57)'];
  const rows = [headerRow];

  // Get all slides
  const slides = element.querySelectorAll(':scope > .carousel-item');
  slides.forEach((slide) => {
    // Get image from .card-img img
    const imgContainer = slide.querySelector('.card-img');
    const img = imgContainer ? imgContainer.querySelector('img') : null;
    // Compose text cell
    const textCell = [];
    // Title (as heading)
    const cardTitle = slide.querySelector('.card-title');
    let link = null;
    if (cardTitle) {
      link = cardTitle.querySelector('a');
      if (link) {
        const heading = document.createElement('h3');
        // Move all nodes (preserve <sup>, etc.)
        [...link.childNodes].forEach((node) => heading.appendChild(node.cloneNode(true)));
        textCell.push(heading);
      }
    }
    // Description
    const descElem = slide.querySelector('.card-text');
    if (descElem) textCell.push(descElem);
    // CTA (link at the bottom, if link exists)
    if (link) {
      const ctaP = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      ctaP.appendChild(a);
      textCell.push(ctaP);
    }
    if (img) {
      rows.push([img, textCell]);
    }
  });
  // Use createTable, passing headerRow as a single cell so it will get colspan=2
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
