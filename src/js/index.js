// scss
import '../scss/main-global.scss';

// js
import { documentReady } from 'utils';
import app from './app';
import { exist } from './utils';

// --------------------------------------------- native javascript extends
window.NodeList.prototype.map = Array.prototype.map;
window.NodeList.prototype.filter = Array.prototype.filter;
window.exist = exist;
window.NodeList.prototype.exist = exist;
window.Node.prototype.exist = exist;
window.Number.prototype.exist = exist;
window.String.prototype.exist = exist;
window.Array.prototype.exist = exist;
// --------------------------------------------- native javascript extends###

const styles = ['color: #fff', 'background: #cf8e1f'].join(';');
const message = 'Developed by Glivera-team https://glivera-team.com/';

// eslint-disable-next-line no-console
console.info('%c%s', styles, message);

// -------------------  init App
documentReady(() => {
	app();
});
// -------------------  init App##
