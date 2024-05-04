// scss
import '../scss/main-global.scss';

// js
import { documentReady } from 'utils';
import { ENV_STATUS } from 'utils/constants';
import app from './app';

// --------------------------------------------- native javascript extends

window.NodeList.prototype.map = Array.prototype.map;
window.NodeList.prototype.filter = Array.prototype.filter;
window.Object.prototype.exist = function () {
	// check if array empty or boolean check for other types
	return Array.isArray(this) ? this?.length > 0 && this.every((item) => item.exist()) : !!this;
};
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
