import {Children, Component} from 'react';
import Head from 'next/head';
import MenuLink from '../components/menu-link';
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
margin-bottom: 1rem;
`;

const Nav = styled.nav`
${maxWidth}
display: flex;
`;

const Spacer = styled.div`
flex: 1;
order: 1;
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
          <MenuLink href='/' logo>Wick</MenuLink>
          {this.props.children}
        <Spacer />
        </Nav>
      </HeaderBar>
    </ThemeProvider>;
  }
}
