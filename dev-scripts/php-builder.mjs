/**
 * PHP Builder Script
 *
 * This script processes HTML files and generates PHP components.
 * It uses JSDOM to parse HTML, creates unique template parts,
 * and generates corresponding PHP files.
 */

/* eslint-disable indent */

import { JSDOM } from 'jsdom';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prettier from 'prettier';

dotenv.config();

export const phpBuild = () => {
	// eslint-disable-next-line no-underscore-dangle
	const __filename = fileURLToPath(import.meta.url);
	// eslint-disable-next-line no-underscore-dangle
	const __dirname = path.dirname(__filename);

	const buildDir = `${path.resolve(__dirname, '../build')}/`;
	const phpDir = path.join(buildDir, './php/');

	/**
	 * Generates a hash for a given string.
	 * @param {string} str - The input string.
	 * @returns {number} The generated hash.
	 */
	const getStringHash = (str) => {
		let hash = 0;
		let i;
		let chr;

		if (str.length === 0) return hash;
		for (i = 0; i < str.length; i += 1) {
			chr = str.charCodeAt(i);
			// eslint-disable-next-line no-bitwise
			hash = (hash << 5) - hash + chr;
			// eslint-disable-next-line no-bitwise
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

	/**
	 * Formats HTML string using Prettier.
	 * @param {string} htmlString - The HTML string to format.
	 * @returns {string} The formatted HTML string.
	 */
	const formatHTML = (htmlString) => {
		return prettier.format(htmlString, {
			parser: 'html',
			htmlWhitespaceSensitivity: 'ignore',
			printWidth: 120,
			tabWidth: 2,
		});
	};

	/**
	 * Reads HTML files from the build directory and creates virtual DOMs.
	 */
	const pagesVirtualDOM = fs
		.readdirSync(buildDir)
		.filter((fileName) => fileName.endsWith('.html'))
		.map((fileName) => {
			const pageContent = fs.readFileSync(path.resolve(buildDir, fileName), 'utf8');
			const DOM = new JSDOM(pageContent);
			return [fileName, DOM.window.document];
		});

	/**
	 * Extracts page data from a document.
	 * @param {Document} document - The document to process.
	 * @returns {Array} An array containing the page name and its parts.
	 */
	const preparePageData = ([fileName, document]) => {
		const $parts = Array.from(document.querySelector('.base').children);
		const parts = $parts.map(($part) => {
			const partCode = $part.outerHTML.replace(/\s+/g, ' ').trim();
			const partName = Array.from($part.classList).find((className) => !className.includes('section'));
			const hash = getStringHash(partCode);
			$part.remove();
			return { hash, partName, partCode };
		});

		return [fileName, { parts }];
	};

	const pages = pagesVirtualDOM.map(preparePageData);

	if (fs.existsSync(phpDir)) fs.rmdirSync(phpDir, { recursive: true });

	fs.mkdirSync(phpDir);

	/**
	 * Creates PHP template parts from the extracted page data.
	 */
	// const allParts = pages.flatMap(([_, { parts }]) => parts);
	const parts = pages.forEach(([page, { parts }]) => {
		const pageName = page.replace('.html', '');
		const pageDir = path.resolve(phpDir, pageName);
		if (!fs.existsSync(pageDir) && parts.length) fs.mkdirSync(pageDir);

		parts.forEach(({ hash, partName = `undefined.${hash}`, partCode }) => {
			const fileName = `${partName}.php`;
			const fileUrl = path.resolve(pageDir, fileName);
			const htmlCode = formatHTML(partCode);
			const phpCode =
				"<?php \n\tif (!defined('ABSPATH')) {\n\t\texit;\n\t}\n\tif (isset($this) && $this instanceof CaAcfController) {\n\t}\n?>\n";
			fs.writeFileSync(fileUrl, phpCode.concat('\n').concat(htmlCode).concat('\n'));
		});
	});
};
phpBuild();
