import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

// eslint-disable-next-line no-path-concat
const distPath = path.join(__dirname, 'build');

const folders = [
	{
		name: 'css',
		ext: '.css',
	},
	{
		name: 'js',
		ext: '.js',
	},
	{
		name: 'fonts',
	},
	{
		name: 'images',
	},
];

folders.forEach(({ name, ext }) => {
	const subFolderPath = path.join(distPath, name);

	fs.mkdirSync(subFolderPath, { recursive: true });

	fs.readdirSync(distPath).forEach((file) => {
		const filePath = path.join(distPath, file);
		const fileExt = path.extname(filePath);

		// --------------------------------------------- update paths in html for each folder
		if (fileExt === '.html') {
			const fileContent = fs.readFileSync(filePath, 'utf8');
			const attribute = ext === '.css' ? 'href' : 'src';

			// eslint-disable-next-line prefer-regex-literals, quotes
			const pattern = new RegExp(attribute.concat(`=["']([^"']+)["']`), 'gm');

			const newFileContent = fileContent.replace(pattern, (str, m) => {
				if (m.endsWith(ext)) {
					const newPath = `${attribute}="${name}/${m}"`;
					console.log(`${newPath} replaced path in ${file}`);
					return newPath;
				}
				return str;
			});
			fs.writeFileSync(filePath, newFileContent, 'utf8');
		}
		// --------------------------------------------- update paths in html for each folder###

		// --------------------------------------------- move files to specific folder
		if (fileExt === ext) {
			const fileNewPath = path.join(distPath, name, file);
			fs.renameSync(filePath, fileNewPath);
		}
		// --------------------------------------------- move files to specific folder###
	});
});
