const puppeteer = require('puppeteer');

/**
 * Scrapes up to `limit` products from a Saruk category page
 * and fetches real data from the individual product detail pages.
 */
const scrapeSarukCategory = async (categoryUrl, limit = 10) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });

  const productLinks = await page.$$eval('.product-thumb h4 a', (links) =>
    links.map((link) => ({
      name: link.innerText.trim(),
      href: link.href
    }))
  );

  const products = [];

  for (const { name, href } of productLinks.slice(0, limit)) {
    try {
      await page.goto(href, { waitUntil: 'domcontentloaded' });

      const priceText = await page.$eval('.price-new', (el) => el.innerText);
      const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

      const description = await page.$eval('#tab-description', (el) =>
        el.innerText.trim()
      );

      const product = {
        name,
        price,
        short_desc: name,
        description,
        stock_quantity: 10 + Math.floor(Math.random() * 20),
        meta_title: name,
        meta_description: `${name} - ${description.slice(0, 140)}...`
      };

      products.push(product);
    } catch (error) {
      console.warn(`❌ Failed to process ${name}:`, error.message);
      continue;
    }
  }

  await browser.close();
  return products;
};

module.exports = { scrapeSarukCategory };
