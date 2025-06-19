/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the internal .row container
  const row = element.querySelector('.row');
  if (!row) return;
  // .row > 2 columns (should be image and text, order is reversed)
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // The visual order is text left, image right, but in DOM because flex-row-reverse, cols[0] is image, cols[1] is text
  const imgCol = cols[0];
  const textCol = cols[1];

  // Extract image element (should be only one)
  const img = imgCol.querySelector('img');
  let imgCell = '';
  if (img) imgCell = img;

  // Extract text content: use .card-body if present, fallback to textCol
  let textCell = '';
  const cardBody = textCol.querySelector('.card-body');
  if (cardBody) {
    // Fix: decode escaped HTML in card-text div, if present
    const cardText = cardBody.querySelector('.card-text');
    if (cardText && cardText.innerHTML.includes('&lt;')) {
      // Create a fragment to contain the fixed HTML
      const frag = document.createDocumentFragment();
      // If there's a heading before the encoded HTML, preserve it
      const heading = cardText.querySelector('h4, h1, h2, h3, h5, h6');
      if (heading) {
        frag.appendChild(heading);
      }
      // Extract the encoded HTML string after the heading
      let htmlString = cardText.innerHTML;
      // Remove the heading HTML if present
      if (heading) {
        htmlString = htmlString.replace(heading.outerHTML, '');
      }
      // Unescape HTML (turn &lt;p&gt;...&lt;/p&gt; into <p>...</p>)
      const temp = document.createElement('div');
      temp.innerHTML = htmlString.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      // Append all unescaped children to the fragment
      Array.from(temp.childNodes).forEach(node => frag.appendChild(node));
      // Replace cardText's contents with the correct fragment
      cardText.innerHTML = '';
      cardText.appendChild(frag);
    }
    textCell = cardBody;
  } else {
    textCell = textCol;
  }

  // Compose table: header row single cell, content row two cells (text, image)
  const cells = [
    ['Columns (columns4)'],
    [textCell, imgCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
