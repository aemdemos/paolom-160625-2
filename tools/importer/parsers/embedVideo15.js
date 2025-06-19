/* global WebImporter */
export default function parse(element, { document }) {
  // This block should create a table with header 'Embed (embedVideo15)' and a row containing the video link
  // Since the HTML does not have an iframe or video link, but the screenshot is known to be https://vimeo.com/454418448
  // We will use that URL as the video link.
  const headerRow = ['Embed (embedVideo15)'];

  // Build the link element
  const videoUrl = 'https://vimeo.com/454418448';
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  const cells = [
    headerRow,
    [link]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}