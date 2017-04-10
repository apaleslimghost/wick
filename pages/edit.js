import {Component} from 'react';
import {pages} from '../db';
import titleCase from 'title-case';
import formJson from '@quarterto/form-json';
import Router from 'next/router';

export default class EditPage extends Component {
  static async getInitialProps({query}) {
    const {slug} = query;
    await pages.allDocs({include_docs: true});
    const {docs} = await pages.find({
      selector: {slug},
      limit: 1
    });
    
    console.log(docs);
    const [page] = docs; 
    
    return {page: page || {}, slug, found: !!page};
  }
  
  async submit(ev) {
    ev.preventDefault();
    const page = formJson(ev.target);
    
    if(this.props.found) {
      
    } else {
      await pages.post(page);
    }
    
    Router.push(page.slug);
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