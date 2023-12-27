import layout from './layout/layout';
import { indexPage } from './pages';
import { articlePage } from './pages/article';
import { uiPage } from './pages/ui';
import { pageLoad } from './utils';

const app = () => {
	layout();
	pageLoad(() => {
		indexPage();
		articlePage();
		uiPage();
		document.body.classList.add('body--loaded');
	});
};

export default app;
