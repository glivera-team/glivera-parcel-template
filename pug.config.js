const { readFileSync } = require('fs');
const { resolve } = require('path');

const directoryUrl = __dirname;

module.exports = {
	locals: {
		readFileSync,
		resolve,
		directoryUrl,
	},
};
