import {Children, Component} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
import styled from 'styled-components';
import {sansScale} from './type-scale';

const Nav = styled.nav`${sansScale(0)}`;

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
    return <header>
      <Head>
        <link rel='stylesheet' href='/static/nprogress.css' />
      </Head>

      <Nav>{this.props.children}</Nav>
    </header>;
  }
}
