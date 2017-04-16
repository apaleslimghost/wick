import colours from '@quarterto/colours';
import {css} from 'styled-components';
import contrast from 'contrast';

module.exports = (colour, level = 3) => css`
background-color: ${colours[colour][level]};
color: ${contrast(colours[colour][level]) === 'light' ? colours.grey[0] : colours.grey[6]};
`;
