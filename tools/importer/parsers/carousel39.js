/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all unique, non-clone carousel images in order
  function getOrderedCarouselImages(element) {
    const galleryWrapper = element.querySelector('#gallery-wrapper');
    if (!galleryWrapper) return [];
    const slides = Array.from(galleryWrapper.querySelectorAll('li')).filter(li => !li.classList.contains('clone'));
    const images = slides.map(li => li.querySelector('img')).filter(Boolean);
    return images;
  }

  // Get all text for the first slide: heading, intro, and tabbed content
  function getFirstSlideTextContent(element) {
    const contents = [];
    // Title (h1 -> h2)
    const descSection = element.querySelector('section.product-description');
    if (descSection) {
      const h1 = descSection.querySelector('h1');
      if (h1) {
        const h2 = document.createElement('h2');
        h2.innerHTML = h1.innerHTML.trim();
        contents.push(h2);
      }
      // Short intro in .col-12
      const col12 = descSection.querySelector('.col-12');
      if (col12) {
        Array.from(col12.children).forEach(child => {
          if (child.tagName === 'P' || child.tagName === 'UL') {
            contents.push(child);
          }
        });
      }
    }
    // Now, append tabbed content: Beschreibung (active tab) and Vorteile
    // Desktop tabs
    const desktopTabs = element.querySelector('.ct-tabs-desktop .tab-content');
    if (desktopTabs) {
      const tabPanes = desktopTabs.querySelectorAll('.tab-pane');
      tabPanes.forEach(tabPane => {
        // Each tab may have multiple Ps and ULs
        Array.from(tabPane.children).forEach(child => {
          // Only include element content, skip things like whitespace
          if (child.tagName === 'P' || child.tagName === 'UL') {
            contents.push(child);
          }
        });
      });
    }
    // If desktop tabs are not present, try mobile accordion
    else {
      const acc = element.querySelector('.ct-tabs-desktop ~ .d-block.d-md-none .ct-accordion-group');
      if (acc) {
        Array.from(acc.querySelectorAll('.card-body')).forEach(cardBody => {
          Array.from(cardBody.children).forEach(child => {
            if (child.tagName === 'P' || child.tagName === 'UL') {
              contents.push(child);
            }
          });
        });
      }
    }
    return contents.length ? contents : undefined;
  }

  // Compose the table
  const cells = [];
  // Header row: exactly one cell
  cells.push(['Carousel (carousel39)']);

  // Images for the slides
  const images = getOrderedCarouselImages(element);
  // All text for first slide (h2, summary, tabs)
  const textContent = getFirstSlideTextContent(element);

  images.forEach((img, idx) => {
    if (idx === 0) {
      cells.push([
        img,
        textContent ? textContent : ''
      ]);
    } else {
      cells.push([
        img,
        ''
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
