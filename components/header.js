import {Children, Component} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
import styled, {ThemeProvider} from 'styled-components';
import {sansScale} from './type-scale';
import {maxWidth} from './grid';
import {grey, teal} from '@quarterto/colours';

const headerBackground = {
  background: grey[6]
};

const HeaderBar = styled.header`
background: ${({theme = {}}) => theme.background};
border-bottom: 1px ${grey[5]} solid;
`;

const Nav = styled.nav`
${sansScale(0)}
${maxWidth}
`;

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => NProgress.done();

export default class Header extends Component {
  render() {
    return <ThemeProvider theme={headerBackground}>
      <HeaderBar>
        <Head>
          <link rel='stylesheet' href='/static/nprogress.css' />
        </Head>

        <Nav>
          {this.props.children}
        </Nav>
      </HeaderBar>
    </ThemeProvider>;
  }
}
