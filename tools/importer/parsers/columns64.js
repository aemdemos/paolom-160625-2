/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header
  const headerRow = ['Columns (columns64)'];

  // Find the content root for this columns block
  // The first .container > .row > .col-12 > .card-body > div
  let mainDiv = null;
  const container = element.querySelector('.container');
  if (container) {
    const row = container.querySelector('.row');
    if (row) {
      const col = row.querySelector('.col-12');
      if (col) {
        const cardBody = col.querySelector('.card-body');
        if (cardBody) {
          // The main content is in the first div inside cardBody
          mainDiv = cardBody.querySelector('div');
        }
      }
    }
  }
  // Fallback: just use first div in section
  if (!mainDiv) {
    mainDiv = element.querySelector('div');
  }

  // Look for card-title and card-text (usual structure)
  let cardTitle = mainDiv ? mainDiv.querySelector('.card-title') : null;
  let cardText = mainDiv ? mainDiv.querySelector('.card-text') : null;

  // If no card-text, possibly the div itself is the text
  if (!cardText && mainDiv) {
    cardText = mainDiv;
  }

  // For the first block: the content is a text and an image centered below
  // For the second block: the content is a heading and paragraphs (all in one column)

  // Look for an image div inside cardText (centered image case)
  let imgDiv = null;
  if (cardText) {
    // Try to find div with text-align:center that contains an img
    imgDiv = cardText.querySelector('div[style*="text-align"] img');
    if (imgDiv) {
      // get the image's parent div (keeps alignment)
      imgDiv = imgDiv.parentElement;
    } else {
      // fallback: just any img
      imgDiv = cardText.querySelector('img');
    }
  }

  let cells;
  if (imgDiv && imgDiv !== cardText) {
    // There is a centered image, split text and image into two columns
    // The first column: the text content (excluding the image div)
    // The second column: the image div
    // Remove the image div from the cardText for column 1
    const col1Content = [];
    if (cardText) {
      // Clone cardText to remove the image div for the first column
      const cardTextClone = cardText.cloneNode(true);
      const imgDivClone = cardTextClone.querySelector('div[style*="text-align"]');
      if (imgDivClone) imgDivClone.remove();
      // Only push if it still has content
      if (cardTitle) {
        col1Content.push(cardTitle);
      }
      // If the cardTextClone has children, push it; else, skip
      if (cardTextClone.innerHTML.trim()) {
        col1Content.push(cardTextClone);
      }
    }
    cells = [
      headerRow,
      [col1Content.length > 1 ? col1Content : col1Content[0], imgDiv]
    ];
  } else {
    // One column: include cardTitle and cardText (heading and paragraphs)
    const col1Content = [];
    if (cardTitle) col1Content.push(cardTitle);
    if (cardText) col1Content.push(cardText);
    cells = [
      headerRow,
      [col1Content.length > 1 ? col1Content : col1Content[0]]
    ];
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
