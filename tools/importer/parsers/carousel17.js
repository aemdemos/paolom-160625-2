/* global WebImporter */
export default function parse(element, { document }) {
  function getDirectDivs(parent) {
    return Array.from(parent.children).filter(el => el.tagName === 'DIV');
  }

  // Find left and right columns
  let leftCol = null;
  let rightCol = null;
  const directDivs = getDirectDivs(element);
  if (directDivs.length === 2) {
    leftCol = directDivs[0];
    rightCol = directDivs[1];
  } else {
    leftCol = element.querySelector('.col-md-5, .col-sm-12') || directDivs[0];
    rightCol = element.querySelector('.col-md-7') || directDivs[1];
  }

  // Get all main carousel images (non-clones)
  function getCarouselImages(col) {
    const ul = col.querySelector('ul.gallery, ul.lightSlider');
    if (!ul) return [];
    return Array.from(ul.querySelectorAll('li'))
      .filter(li => !li.classList.contains('clone'))
      .map(li => li.querySelector('img'))
      .filter(Boolean);
  }

  // Get text content for the slide(s)
  function getTextContent(col) {
    const cardBody = col.querySelector('.card-body') || col;
    const cardText = cardBody.querySelector('.card-text') || cardBody;
    const productDesc = cardText.querySelector('section.product-description') || cardText;
    let heading = productDesc.querySelector('h1');
    if (!heading) heading = productDesc.querySelector('h2, h3');
    const descParas = Array.from(productDesc.querySelectorAll('p'));
    const cta = productDesc.querySelector('.product-cta');
    let result = [];
    if (heading) result.push(heading);
    if (descParas.length > 0) result = result.concat(descParas);
    if (cta) result.push(cta);
    return result;
  }

  // For POWERCIAT, also grab the certificate section
  function getPowerciatContent(col) {
    const cardBody = col.querySelector('.card-body') || col;
    const cardText = cardBody.querySelector('.card-text') || cardBody;
    const productDesc = cardText.querySelector('section.product-description');
    const certSection = cardText.querySelector('section.ct-product-certificate');
    let result = [];
    if (productDesc) result.push(productDesc);
    if (certSection) result.push(certSection);
    return result;
  }

  const isPowerciat = rightCol && rightCol.querySelector('section.ct-product-certificate');

  const images = getCarouselImages(leftCol);
  const textContent = isPowerciat
    ? getPowerciatContent(rightCol)
    : getTextContent(rightCol);

  // Build rows: only the LAST image gets the text content, others get an empty cell
  const headerRow = ['Carousel (carousel17)'];
  const rows = images.map((img, idx) => {
    if (idx === images.length - 1) {
      return [img, textContent.length === 1 ? textContent[0] : textContent];
    }
    return [img, ''];
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}