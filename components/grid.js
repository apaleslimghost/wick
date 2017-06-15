import styled, {css} from 'styled-components';

export const container = width => css`
padding-left: 5%;
padding-right: 5%;
margin-left: auto;
margin-right: auto;
max-width: ${width};
`;

export const maxWidth = container('60rem');

export const Row = styled.div`
display: flex;
justify-content: space-between;
margin-left: -1rem;
margin-right: -1rem;

& > * {
	margin-right: 1rem;
	margin-left: 1rem;
	flex: 1;
}
`;

export const span = width => css`
flex-basis: ${100 * width}%;
`;
