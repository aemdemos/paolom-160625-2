/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main row holding the columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get immediate column divs
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  // Figure out direction: if flex-row-reverse, image is on the right visually
  const isReversed = row.classList.contains('flex-row-reverse');
  // Always reference the existing elements, no clones
  let imgCol, textCol;
  if (isReversed) {
    imgCol = cols[1];
    textCol = cols[0];
  } else {
    imgCol = cols[0];
    textCol = cols[1];
  }

  // IMAGE CELL: grab the <img> element directly (if any)
  const imgWrap = imgCol.querySelector('.card-img');
  let imgEl = imgWrap ? imgWrap.querySelector('img') : null;

  // TEXT CELL: grab the content fragment
  const cardBody = textCol.querySelector('.card-body');
  let containerDiv = cardBody ? cardBody.querySelector('div') : null;
  let titleDiv = containerDiv ? containerDiv.querySelector('.card-title') : null;
  let textDiv = containerDiv ? containerDiv.querySelector('.card-text') : null;
  // Construct a fragment with all text elements (title, then text)
  const frag = document.createDocumentFragment();
  if (titleDiv) frag.appendChild(titleDiv);
  if (textDiv) frag.appendChild(textDiv);

  // If there's no image, put null in first col
  const contentRow = isReversed ? [frag, imgEl] : [imgEl, frag];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns5)'],
    contentRow
  ], document);

  element.replaceWith(table);
}
