/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (matches example exactly)
  const cells = [
    ['Cards (cards37)'],
  ];

  // Extract image URL from hidden compare-item .img-url span
  const compareItem = element.querySelector('.compare-item');
  let imgUrl = '';
  if (compareItem) {
    const imgUrlSpan = compareItem.querySelector('.img-url');
    if (imgUrlSpan && imgUrlSpan.textContent.trim()) {
      imgUrl = imgUrlSpan.textContent.trim();
    }
  }
  let imgEl = null;
  if (imgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.alt = '';
  }

  // Extract subtitle (bold heading) and title
  // Subtitle is in .card-subtitle > a (keep innerHTML for sup), title is in .card-title > a
  let subtitle = '';
  let title = '';
  const subtitleDiv = element.querySelector('.card-subtitle');
  if (subtitleDiv) {
    const a = subtitleDiv.querySelector('a');
    subtitle = a ? a.innerHTML.trim() : subtitleDiv.innerHTML.trim();
  }
  const titleDiv = element.querySelector('.card-title');
  if (titleDiv) {
    const a = titleDiv.querySelector('a');
    title = a ? a.textContent.trim() : titleDiv.textContent.trim();
  }

  // Compose text cell: subtitle (strong), then title (span)
  const textCell = document.createElement('div');
  if (subtitle) {
    const strong = document.createElement('strong');
    strong.innerHTML = subtitle;
    textCell.appendChild(strong);
    textCell.appendChild(document.createElement('br'));
  }
  if (title) {
    const span = document.createElement('span');
    span.textContent = title;
    textCell.appendChild(span);
  }

  // Add the row only if there is either an image or text content
  if (imgEl || textCell.childNodes.length > 0) {
    cells.push([
      imgEl,
      textCell
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
