import {Children, Component} from 'react';
import Head from 'next/head';
import MenuLink from '../components/menu-link';
import NProgress from 'nprogress';
import Router from 'next/router';
import styled, {ThemeProvider} from 'styled-components';
import {sansScale, baseSize} from './type-scale';
import {maxWidth} from './grid';
import {grey, teal} from '@quarterto/colours';
import {withBreakpoints, bp} from 'react-element-breakpoints';

const headerBackground = {
  background: grey[6]
};

const headerBreakpoints = withBreakpoints({
  wide: ({width}) => (width / baseSize) > 30
});

const HeaderBar = styled.header`
background: ${({theme = {}}) => theme.background};
border-bottom: 1px ${grey[5]} solid;
margin-bottom: 1rem;
`;

const Nav = styled.nav`
${maxWidth}
display: flex;
`;

const Spacer = styled.div`
flex: 1;
order: 1;

display: ${bp('none', {wide: 'block'})};
`;

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => NProgress.done();

export default headerBreakpoints(({children, breakpoints}) => <ThemeProvider theme={headerBackground}>
  <HeaderBar>
    <Head>
      <link rel='stylesheet' href='/static/nprogress.css' />
    </Head>

    <Nav>
      <MenuLink href='/' logo>Wick</MenuLink>
      {children}
      <Spacer breakpoints={breakpoints} />
    </Nav>
  </HeaderBar>
</ThemeProvider>);
