import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateSprite } from './sprite-builder.mjs';

generateSprite();

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const selectFilesRecursive = (rootUrl, onMatch) => {
	const files = fs.readdirSync(rootUrl, { recursive: true });

	files.forEach((fileName) => {
		const fileUrl = path.resolve(rootUrl, './'.concat(fileName));
		const stat = fs.statSync(fileUrl);
		const fileData = {
			rootUrl,
			fileName,
			fileUrl,
		};

		if (stat && stat.isDirectory()) {
			selectFilesRecursive(fileUrl, onMatch);
		} else {
			onMatch(fileData);
		}
	});
};

// ---------------------------------------------
const buildDir = path.resolve(__dirname, '../build');
const buildData = [];
selectFilesRecursive(buildDir, (fileData) => {
	buildData.push(fileData);
});
// ---------------------------------------------###

// ---------------------------------------------
// const srcDir = path.resolve(__dirname, '../src');
// const srcData = [];
// selectFilesRecursive(srcDir, (fileData) => {
// 	srcData.push(fileData);
// });
// ---------------------------------------------###

// ---------------------------------------------

buildData.forEach(({ rootUrl, fileName, fileUrl }, index) => {
	const extName = path.extname(fileName);
	let newFileName = fileName;
	let newFileUrl = fileUrl;
	// --------------------------------------------- remove hashes
	// const fileNameArray = fileName.split('.');
	// if (fileNameArray.length > 2) fileNameArray.splice(-2, 1);
	// const newFileName = fileNameArray.join('.');
	// const newFileUrl = rootUrl.concat('/').concat(newFileName);
	// fs.renameSync(fileUrl, newFileUrl);
	// --------------------------------------------- remove hashes###

	// --------------------------------------------- remove first name
	if (extName === '.js' || extName === '.css') {
		newFileName = 'app'.concat(extName);
		newFileUrl = rootUrl.concat('/').concat(newFileName);

		buildData.forEach((file) => {
			const ext = path.extname(file.fileName);
			if (file.fileUrl === fileUrl || ext !== '.html') return;

			const fileContent = fs.readFileSync(file.fileUrl, 'utf8');
			const regEx = new RegExp(fileName, 'g');
			const newFileContent = fileContent.replace(regEx, newFileName);
			fs.writeFileSync(file.fileUrl, newFileContent);
		});

		fs.renameSync(fileUrl, newFileUrl);
	}
	// --------------------------------------------- remove first name###

	buildData[index] = {
		rootUrl,
		fileName: newFileName,
		fileUrl: newFileUrl,
	};

	// --------------------------------------------- set directory

	// --------------------------------------------- set directory###

	// --------------------------------------------- update content

	// --------------------------------------------- update content###
});
