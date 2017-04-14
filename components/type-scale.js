import {css} from 'styled-components';
import range from 'lodash.range';

export const baseSize = 16;
export const capHeights = {
	'Merriweather': 0.7,
	'Merriweather Sans': 0.5,
};

const props = font => scale => {
	const lineHeight = Math.floor(scale) + 1;
	const baselineDistance = (lineHeight - capHeights[font]) / 2;

	return css`
	font-family: ${font};
	font-size: ${scale}rem;
	line-height: ${lineHeight}rem;
	position: relative;
	top: ${baselineDistance}rem;
	margin: 0 0 1rem;
	`;
}

const square = x => x * x;
const divideScale = x => x / 6;
const plusOne = x => x + 1;
const compose = (...fns) => x => fns.reduce((y, fn) => fn(y), x);

export const scale = font => compose(divideScale, square, plusOne, props(font));
export const sansScale = scale('Merriweather Sans');
export const serifScale = scale('Merriweather');
