import {css} from 'styled-components';
import range from 'lodash.range';

export const baseSize = 16;
export const capHeights = {
	'Merriweather': 0.8,
	'Merriweather Sans': 0.9,
};

const props = font => scale => {
	const lineHeight = Math.floor(scale) + 1;
	const baselineDistance = (lineHeight - capHeights[font] * scale) / 2;

	return css`
	font-family: ${font};
	font-size: ${scale}rem;
	line-height: ${lineHeight}rem;
	position: relative;
	top: ${baselineDistance}rem;
	margin-bottom: 1rem;
	`;
}

const cube = x => x * x * x;
const divideScale = x => x / 5;
const plusOne = x => x + 1;
const compose = (...fns) => x => fns.reduce((y, fn) => fn(y), x);

const scaled = compose(divideScale, cube, plusOne);

export const scale = font => compose(scaled, props(font));
export const sansScale = scale('Merriweather Sans');
export const serifScale = scale('Merriweather');
