import {Component} from 'react';
import MenuLink from '../components/menu-link';
import Head from 'next/head';
import {pages} from '../db';
import titleCase from 'title-case';
import formJson from '@quarterto/form-json';
import Router from 'next/router';
import getPage from '../get-page';
import SimpleMDE from 'react-simplemde-editor';
import Header from '../components/header';
import styled from 'styled-components';

const Input = styled.input`
font: inherit;
`;

export default class EditPage extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      content: props.page.content
    };
  }

  static getInitialProps({query}) {
    return getPage(query.slug);
  }

  async submit(ev) {
    ev.preventDefault();
    const form = formJson(ev.target)
    const slug = (form.slug || this.props.slug).replace(/ /g, '_');
    const page = Object.assign(
      this.props.page,
      form,
      this.state,
      {lastUpdated: new Date(), slug}
    );

    if(this.props.found) {
      await pages.put(page);
    } else {
      await pages.post(Object.assign(page, {
        created: new Date(),
      }));
    }

    Router.push({pathname: '/page', query: {slug}}, slug);
  }

  render() {
    const lastSlugPart = this.props.slug.split('/').reverse()[0];
    const fallbackTitle = titleCase(lastSlugPart.replace(/_/g, ' '));

    return <form onSubmit={ev => this.submit(ev)}>
      <Head>
        <link href='/static/simplemde.min.css' rel='stylesheet' />
      </Head>
      <Header>
        <MenuLink preload href={{pathname: '/page', query: {slug: this.props.slug}}} as={this.props.slug}>Back</MenuLink>
      </Header>
      <h1>
        <Input name='title' defaultValue={this.props.page.title || fallbackTitle} placeholder='Title' />
      </h1>
      <h2>
        <Input name='slug' defaultValue={this.props.slug} placeholder='title' />
      </h2>
      <SimpleMDE value={this.state.content} onChange={content => this.setState({content})} />
      <input type='submit' />
    </form>;
  }
}
