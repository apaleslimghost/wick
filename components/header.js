import {Children, Component} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';

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

      <nav>{this.props.children}</nav>
    </header>;
  }
}
