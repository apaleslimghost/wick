import {Children, Component} from 'react';
import Head from 'next/head';
import MenuLink, {Anchor} from '../components/menu-link';
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
  multiline: ({height}) => height > baseSize * 3,
});

const HeaderBar = styled.header`
background: ${({theme = {}}) => theme.background};
border-bottom: 1px ${grey[5]} solid;
margin-bottom: 1rem;
height: ${({showMenu}) => showMenu ? 'auto' : '3rem'};
overflow: hidden;
`;

const Nav = styled.nav`
${maxWidth}
display: flex;
flex-wrap: wrap;
position: relative;
`;

const Hamburger = styled(Anchor)`
position: absolute;
right: 5%;
`;

const Menu = headerBreakpoints(({breakpoints, children, clickHamburger}) => <Nav>
  <MenuLink href='/' logo>Wick</MenuLink>
  {breakpoints.multiline && <Hamburger href='#' onClick={clickHamburger}>☰</Hamburger>}

  <Left>{leftChildren(children)}</Left>
  <Right>{rightChildren(children)}</Right>
</Nav>);

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => NProgress.done();

const leftChildren = children => children.filter(({props = {}}) => !props.right);
const rightChildren = children => children.filter(({props = {}}) => props.right);

const Left = styled.div`
flex: 1;
display: flex;
margin-right: 3rem;
`;

const Right = styled.div`
`;

class TogglableMenu extends Component {
  constructor(...args) {
    super(...args);
    this.state = {showMenu: false};
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(({showMenu}) => ({showMenu: !showMenu}));
  }

  render() {
    return <HeaderBar showMenu={this.state.showMenu}>
      <Head>
        <link rel='stylesheet' href='/static/nprogress.css' />
      </Head>

      <Menu clickHamburger={this.toggleMenu}>{this.props.children}</Menu>
    </HeaderBar>;
  }
}

export default ({children}) => <ThemeProvider theme={headerBackground}>
  <TogglableMenu>{children}</TogglableMenu>
</ThemeProvider>;
