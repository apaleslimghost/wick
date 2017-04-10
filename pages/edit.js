import {Component} from 'react';
import {pages} from '../db';
import titleCase from 'title-case';
import formJson from '@quarterto/form-json';
import Router from 'next/router';
import getPage from '../get-page';

export default class EditPage extends Component {
  static getInitialProps({query}) {
    return getPage(query.slug);
  }

  async submit(ev) {
    ev.preventDefault();
    const page = formJson(ev.target);

    if(this.props.found) {
      await pages.put(Object.assign(this.props.page, page));
    } else {
      await pages.post(page);
    }

    const slug = page.slug || this.props.slug;
    Router.push({pathname: '/page', query: {slug}}, slug);
  }

  render() {
    const lastSlugPart = this.props.slug.split('/').reverse()[0];
    const fallbackTitle = titleCase(lastSlugPart.replace(/_/g, ' '));

    return <form onSubmit={ev => this.submit(ev)}>
      <h1><input name='title' defaultValue={this.props.page.title || fallbackTitle} placeholder='Title' /></h1>
      <h2><input name='slug' defaultValue={this.props.slug} placeholder='title' /></h2>
      <textarea name='content' defaultValue={this.props.page.content} />
      <input type='submit' />
    </form>;
  }
}
