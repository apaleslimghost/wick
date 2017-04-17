import {Component} from 'react';
import MenuLink, {MenuItem} from '../components/menu-link';
import Head from 'next/head';
import {pages} from '../db';
import titleCase from 'title-case';
import formJson from '@quarterto/form-json';
import Router from 'next/router';
import getPage from '../get-page';
import SimpleMDE from 'react-simplemde-editor';
import Header from '../components/header';
import styled, {css} from 'styled-components';
import {maxWidth} from '../components/grid';
import {teal} from '@quarterto/colours';
import {sansScale, serifScale} from '../components/type-scale';
import range from 'lodash.range';
import {Heading} from '../components/typography';

const Form = styled.form`
${maxWidth}
`;

const Input = styled.input`
font: inherit;
border: 0 none;
background: none;
border-bottom: .1em ${teal[5]} solid;
margin-bottom: 1rem;

&:focus {
  outline: 0 none;
  border-color: ${teal[4]};
}
`;

const Editor = styled(SimpleMDE)`
${sansScale(0)}

.CodeMirror {
  height: calc(100vh - 20rem);
  overflow-y: auto;
}

.cm-formatting {
  opacity: 0.3;
}

.CodeMirror .CodeMirror-code {
  ${range(5).map(i => css`
  .cm-header-${i + 1} {
    display: inline-block;
    margin: 0;
    ${serifScale(6 - i)}
  }`)}
}
`;

const editorToolbar = [
  'bold', 'italic', 'strikethrough', '|',
  'heading', 'heading-smaller', 'heading-bigger', '|',
  'quote', 'unordered-list', 'ordered-list', '|',
  'link', 'image', 'horizontal-rule',
];

export default class EditPage extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      content: props.page.content || ''
    };
  }

  static getInitialProps({query}) {
    return getPage(query.slug);
  }

  async submit(ev) {
    ev.preventDefault();
    if(!this.form) return;

    const form = formJson(this.form);
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

    return <main>
      <Head>
        <link href='/static/simplemde.min.css' rel='stylesheet' />
      </Head>
      <Header>
        <MenuLink right danger preload href={{pathname: '/page', query: {slug: this.props.slug}}} as={this.props.slug}>
          Back
        </MenuLink>
        <MenuItem right primary onClick={ev => this.submit(ev)}>
          Save
        </MenuItem>
      </Header>
      <Form ref={form => this.form = form}>
        <Heading anchor={false} level={1}>
          <Input name='title' defaultValue={this.props.page.title || fallbackTitle} placeholder='Title' />
        </Heading>

        <Input name='slug' defaultValue={this.props.slug} placeholder='title' />
        <Editor
          value={this.state.content.trim()}
          onChange={content => this.setState({content})}
          options={{toolbar: editorToolbar}}
        />
      </Form>
    </main>;
  }
}
