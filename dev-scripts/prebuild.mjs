import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const createSitemap = () => {
	const PAGES_DIR = `${path.resolve(__dirname, '../src')}/pug/pages/`;
	const pagesArray = fs
		.readdirSync(PAGES_DIR)
		.filter((fileName) => fileName.endsWith('.pug'))
		.map((page) => `'${page.split('.').slice(0, -1).join('.')}'`);
	// SITEMAP.split('.').slice(0, -1).join('.');

	const directoryPath = './src/pug/templates/global-vars.pug';
	const sitemapVariableStr = `\n- _sitemap = [${pagesArray}];`;

	fs.readFile(directoryPath, 'utf-8', (err, oldContent) => {
		if (err) return;
		const newContent = oldContent.replace(/(private_vars).*/gs, '$1');
		fs.writeFile(directoryPath, newContent.concat(sitemapVariableStr), 'utf-8', () => undefined);
	});
};

createSitemap();
