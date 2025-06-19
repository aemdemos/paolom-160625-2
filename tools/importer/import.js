/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import accordion3Parser from './parsers/accordion3.js';
import cards1Parser from './parsers/cards1.js';
import accordion10Parser from './parsers/accordion10.js';
import columns8Parser from './parsers/columns8.js';
import cards9Parser from './parsers/cards9.js';
import columns4Parser from './parsers/columns4.js';
import accordion7Parser from './parsers/accordion7.js';
import columns5Parser from './parsers/columns5.js';
import cards12Parser from './parsers/cards12.js';
import accordion16Parser from './parsers/accordion16.js';
import columns2Parser from './parsers/columns2.js';
import embedVideo15Parser from './parsers/embedVideo15.js';
import cards13Parser from './parsers/cards13.js';
import accordion18Parser from './parsers/accordion18.js';
import accordion22Parser from './parsers/accordion22.js';
import cards19Parser from './parsers/cards19.js';
import hero23Parser from './parsers/hero23.js';
import accordion11Parser from './parsers/accordion11.js';
import cards25Parser from './parsers/cards25.js';
import columns21Parser from './parsers/columns21.js';
import carousel20Parser from './parsers/carousel20.js';
import columns24Parser from './parsers/columns24.js';
import columns6Parser from './parsers/columns6.js';
import hero28Parser from './parsers/hero28.js';
import columns29Parser from './parsers/columns29.js';
import hero36Parser from './parsers/hero36.js';
import hero32Parser from './parsers/hero32.js';
import carousel17Parser from './parsers/carousel17.js';
import tabs27Parser from './parsers/tabs27.js';
import columns38Parser from './parsers/columns38.js';
import cards37Parser from './parsers/cards37.js';
import carousel31Parser from './parsers/carousel31.js';
import columns33Parser from './parsers/columns33.js';
import columns26Parser from './parsers/columns26.js';
import search40Parser from './parsers/search40.js';
import accordion47Parser from './parsers/accordion47.js';
import columns41Parser from './parsers/columns41.js';
import cards30Parser from './parsers/cards30.js';
import cards49Parser from './parsers/cards49.js';
import hero48Parser from './parsers/hero48.js';
import cards46Parser from './parsers/cards46.js';
import columns50Parser from './parsers/columns50.js';
import cards52Parser from './parsers/cards52.js';
import cards35Parser from './parsers/cards35.js';
import hero54Parser from './parsers/hero54.js';
import hero56Parser from './parsers/hero56.js';
import hero53Parser from './parsers/hero53.js';
import accordion51Parser from './parsers/accordion51.js';
import cards59Parser from './parsers/cards59.js';
import carousel55Parser from './parsers/carousel55.js';
import hero61Parser from './parsers/hero61.js';
import accordion62Parser from './parsers/accordion62.js';
import accordion63Parser from './parsers/accordion63.js';
import carousel57Parser from './parsers/carousel57.js';
import accordion58Parser from './parsers/accordion58.js';
import accordion60Parser from './parsers/accordion60.js';
import accordion67Parser from './parsers/accordion67.js';
import cards66Parser from './parsers/cards66.js';
import accordion68Parser from './parsers/accordion68.js';
import columns64Parser from './parsers/columns64.js';
import accordion65Parser from './parsers/accordion65.js';
import columns70Parser from './parsers/columns70.js';
import accordion69Parser from './parsers/accordion69.js';
import carousel39Parser from './parsers/carousel39.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  accordion3: accordion3Parser,
  cards1: cards1Parser,
  accordion10: accordion10Parser,
  columns8: columns8Parser,
  cards9: cards9Parser,
  columns4: columns4Parser,
  accordion7: accordion7Parser,
  columns5: columns5Parser,
  cards12: cards12Parser,
  accordion16: accordion16Parser,
  columns2: columns2Parser,
  embedVideo15: embedVideo15Parser,
  cards13: cards13Parser,
  accordion18: accordion18Parser,
  accordion22: accordion22Parser,
  cards19: cards19Parser,
  hero23: hero23Parser,
  accordion11: accordion11Parser,
  cards25: cards25Parser,
  columns21: columns21Parser,
  carousel20: carousel20Parser,
  columns24: columns24Parser,
  columns6: columns6Parser,
  hero28: hero28Parser,
  columns29: columns29Parser,
  hero36: hero36Parser,
  hero32: hero32Parser,
  carousel17: carousel17Parser,
  tabs27: tabs27Parser,
  columns38: columns38Parser,
  cards37: cards37Parser,
  carousel31: carousel31Parser,
  columns33: columns33Parser,
  columns26: columns26Parser,
  search40: search40Parser,
  accordion47: accordion47Parser,
  columns41: columns41Parser,
  cards30: cards30Parser,
  cards49: cards49Parser,
  hero48: hero48Parser,
  cards46: cards46Parser,
  columns50: columns50Parser,
  cards52: cards52Parser,
  cards35: cards35Parser,
  hero54: hero54Parser,
  hero56: hero56Parser,
  hero53: hero53Parser,
  accordion51: accordion51Parser,
  cards59: cards59Parser,
  carousel55: carousel55Parser,
  hero61: hero61Parser,
  accordion62: accordion62Parser,
  accordion63: accordion63Parser,
  carousel57: carousel57Parser,
  accordion58: accordion58Parser,
  accordion60: accordion60Parser,
  accordion67: accordion67Parser,
  cards66: cards66Parser,
  accordion68: accordion68Parser,
  columns64: columns64Parser,
  accordion65: accordion65Parser,
  columns70: columns70Parser,
  accordion69: accordion69Parser,
  carousel39: carousel39Parser,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
};

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.entries(transformers).forEach(([, transformerFn]) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const pageElements = [{ name: 'metadata' }];

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all block elements using parsers
  [...pageElements, ...blockElements].forEach(({ element = main, ...pageBlock }) => {
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, element, { ...source });
      // parse the element
      WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      parserFn.call(this, element, { ...source });
      WebImporter.DOMUtils.createTable = tableBuilder.restore();
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, element, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${pageBlock.key}`, e);
    }
  });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);

    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
          parserFn.call(this, element, source);
          WebImporter.DOMUtils.createTable = tableBuilder.restore();
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    // sanitize the original URL
    /* eslint-disable no-param-reassign */
    source.params.originalURL = new URL(originalURL).href;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
