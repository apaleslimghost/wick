import {css} from 'styled-components';

const base = css`
text-decoration: none;
background-position: 0 95%;
background-repeat: repeat-x;
background-size: 100% .15rem;
`;

export const ruleBackground = bg => css`
text-shadow: 0.1rem 0 ${bg}, 0.15rem 0 ${bg}, -0.1rem 0 ${bg}, -0.15rem 0 ${bg};
`;

export const ruleColor = color => css`
background-image: linear-gradient(to bottom, transparent 50%, ${color} 50%);
`;

export default (color, bg = '#fff') => css`
${base}
${ruleColor(color)}
${ruleBackground(bg)}
`;
