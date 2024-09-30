import { execSync } from 'child_process';

try {
	execSync('node dev-scripts/clear-cache.mjs');
	execSync(
		'parcel build src/pug/pages/*.pug --dist-dir=build --no-source-maps --no-cache --no-content-hash --public-url=./',
	);
} catch (error) {
	console.log(error.message);
} finally {
	execSync('node dev-scripts/postbuild.mjs');
}
