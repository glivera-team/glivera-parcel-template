import layout from './layout/layout';
import { pageLoad } from './utils';

const app = () => {
	layout();
	pageLoad(() => {
		document.body.classList.add('body--loaded');
	});
};

export default app;
