/* eslint-disable indent */
import { JSDOM } from 'jsdom';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const BUILD_DIR = `${path.resolve(__dirname, '../build')}/`;
const imagesDir = `${BUILD_DIR}images/`;
const spiteDir = `${imagesDir}sprite/`;

export const generateSprite = () => {
	const svgData = {};
	fs.readdirSync(BUILD_DIR)
		.filter((fileName) => fileName.endsWith('.html'))
		.forEach((page) => {
			const pageContent = fs.readFileSync(path.resolve(BUILD_DIR, page), 'utf8');
			const DOM = new JSDOM(pageContent);
			const document = DOM.window.document;
			const pageSvg = document.querySelectorAll('[data-sprite-icon]');

			pageSvg.forEach((svgWrap) => {
				const iconName = svgWrap.dataset.spriteIcon;
				const svg = svgWrap.querySelector('svg');

				if (!svg || !iconName) return;

				const useCode = `
					<svg>
						<use xlink:href="images/sprite/sprite.svg#${iconName}"></use>
					</svg>
				`;

				svgData[iconName] = {
					viewBox: svg.getAttribute('viewBox'),
					paths: svg.innerHTML,
				};

				// eslint-disable-next-line no-param-reassign
				svgWrap.innerHTML = useCode;
			});

			const newLayout = '<!DOCTYPE html>'.concat(document.documentElement.outerHTML);

			fs.writeFileSync(path.resolve(BUILD_DIR, page), newLayout);
		});

	const spriteCode = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<style>
					.sprite-symbol-usage {display: none;}
					.sprite-symbol-usage:target {display: inline;}
				</style>
				${Object.entries(svgData)
					.map(([iconName, iconContent]) => {
						return `
						<symbol viewBox="${iconContent.viewBox || '0 0 18 18'}" id="${iconName}">${iconContent.paths}</symbol>
					`;
					})
					.join('')}

			</defs>
			${Object.entries(svgData)
				.map(([iconName, value]) => {
					return `<use id="${iconName}-usage" xlink:href="#${iconName}" class="sprite-symbol-usage" />`;
				})
				.join('')}
		</svg>
	`;

	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir);
	}

	if (!fs.existsSync(spiteDir)) {
		fs.mkdirSync(spiteDir);
	}

	fs.writeFileSync(spiteDir.concat('sprite.svg'), spriteCode);
};
