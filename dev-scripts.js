const fs = require('fs');
const path = require('path');

const createSitemap = () => {
	const PAGES_DIR = `${path.resolve(__dirname, 'src')}/pug/pages/`;
	const SITEMAP = fs
		.readdirSync(PAGES_DIR)
		.filter((fileName) => fileName.endsWith('.pug'))
		.map((page) => `'${page.split('.').slice(0, -1).join('.')}'`);
	// SITEMAP.split('.').slice(0, -1).join('.');

	const directoryPath = './src/js/dev-vendors';
	const fileName = 'sitemap.js';
	const fileContent = `export const SITEMAP = [${SITEMAP}];`;

	fs.writeFile(`${directoryPath}/${fileName}`, fileContent, () => {});
};

createSitemap();
