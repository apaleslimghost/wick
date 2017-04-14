import styled, {css} from 'styled-components';
import {sansScale, serifScale} from './type-scale';
import range from 'lodash.range';

const header = level => styled(`h${level}`)`
margin: 0;
${(level < 3 ? serifScale : sansScale)(7 - level)}
${level < 3 && css`
font-weight: 900;
`}`;

export default ({level, ...props}) => {
	const H = header(level);
	return <H {...props} />;
};
