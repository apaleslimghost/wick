import colours from '@quarterto/colours';
import {css} from 'styled-components';
import contrast from 'contrast';

export const setColour = colour => css`
background-color: ${colour};
color: ${contrast(colour) === 'light' ? colours.grey[0] : colours.grey[6]};
`;


export default (colour, level = 3) => setColour(colours[colour][[level]]);
