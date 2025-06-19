/* global WebImporter */
export default function parse(element, { document }) {
  // Find section containing the tabs
  const section = element.querySelector('section.ct-tabs-desktop');
  if (!section) return;

  // Extract tab labels and tab content elements
  let tabLabels = [];
  let tabContentElems = [];
  const navTabs = section.querySelector('ul.nav-tabs');
  const tabContent = section.querySelector('.tab-content');
  if (navTabs && tabContent) {
    // Desktop: get labels and content in order
    tabLabels = Array.from(navTabs.querySelectorAll('li > a')).map(a => a.textContent.trim());
    tabContentElems = Array.from(tabContent.children);
  } else {
    // Fallback to mobile accordion
    const accordion = section.querySelector('.ct-accordion-group');
    if (accordion) {
      const cards = Array.from(accordion.querySelectorAll('.card'));
      tabLabels = cards.map(card => {
        const span = card.querySelector('.card-header span');
        return span ? span.textContent.trim() : '';
      });
      tabContentElems = cards.map(card => card.querySelector('.card-body'));
    }
  }

  // Compose table: header row is a single cell, each tab row is [label, content]
  const rows = [];
  rows.push(['Tabs (tabs27)']);
  for (let i = 0; i < tabLabels.length; i++) {
    let label = tabLabels[i] || '';
    let contentElem = tabContentElems[i];
    let contentCell = '';
    if (contentElem) {
      // Use existing element nodes as the cell content
      if (contentElem.childNodes.length === 1) {
        contentCell = contentElem.firstChild;
      } else if (contentElem.childNodes.length > 1) {
        contentCell = Array.from(contentElem.childNodes);
      } else {
        contentCell = '';
      }
    }
    rows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
