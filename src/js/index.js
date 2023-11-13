// scss
import '../scss/main-global.scss';

// js
import { documentReady } from 'utils';
import { ENV_STATUS } from 'utils/constants';
import app from './app';

const styles = ['color: #fff', 'background: #cf8e1f'].join(';');
const message = 'Developed by Glivera-team https://glivera-team.com/';
// eslint-disable-next-line no-console
console.info('%c%s', styles, message);

// -------------------  init App
documentReady(() => {
	app();
});
// -------------------  init App##
