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
import {Heading, Paragraph} from '../components/typography';
import {requireAuth} from '../auth';

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
  height: calc(100vh - 25rem);
  overflow-y: auto;
}

.cm-formatting {
  opacity: 0.3;
}

.CodeMirror .CodeMirror-code {
  ${range(5).map(
		i => css`
  .cm-header-${i + 1} {
    display: inline-block;
    margin: 0;
    ${serifScale(6 - i)}
  }`,
	)}
}
`;

const editorToolbar = [
	'bold',
	'italic',
	'strikethrough',
	'|',
	'heading',
	'heading-smaller',
	'heading-bigger',
	'|',
	'quote',
	'unordered-list',
	'ordered-list',
	'|',
	'link',
	'image',
	'horizontal-rule',
];

export default class EditPage extends Component {
	constructor(props, ...args) {
		super(props, ...args);

		const lastSlugPart = props.slug.split('/').reverse()[0];
		const fallbackTitle = titleCase(lastSlugPart.replace(/_/g, ' '));

		this.state = Object.assign(
			{
				title: fallbackTitle,
				content: '',
				slug: props.slug,
			},
			props.page,
		);

		this.state.slug = this.state.slug.slice(1);
	}

	static async getInitialProps({query, req, res}) {
		await requireAuth({req, res});

		return getPage(query.slug);
	}

	async submit(ev) {
		ev.preventDefault();
		if (!this.form) return;

		const form = formJson(this.form);
		const slug = (form.slug || this.props.slug)
			.replace(/ /g, '_')
			.replace(/^\/?/, '/');
		const page = Object.assign(this.props.page, form, this.state, {
			lastUpdated: new Date(),
			slug,
		});

		if (this.props.found) {
			await pages.put(page);
		} else {
			await pages.post(
				Object.assign(page, {
					created: new Date(),
				}),
			);
		}

		if (slug === '/_index') {
			Router.push('/index', '/');
		} else {
			Router.push({pathname: '/page', query: {slug}}, slug);
		}
	}

	render() {
		const isNewPage = !this.props.slug || !this.props.found;
		const isHomePage = this.props.slug === '/_index';

		return (
			<main>
				<Head>
					<link href="/static/simplemde.min.css" rel="stylesheet" />
				</Head>

				<Header>
					<MenuLink
						right
						danger
						preload
						href={
							isNewPage || isHomePage
								? {pathname: '/index'}
								: {pathname: '/page', query: {slug: this.props.slug}}
						}
						as={isNewPage || isHomePage ? '/' : this.props.slug}
					>
						Back
					</MenuLink>
					<MenuItem right primary onClick={ev => this.submit(ev)}>
						Save
					</MenuItem>
				</Header>

				<Form innerRef={form => (this.form = form)}>
					<Heading anchor={false} level={1}>
						{isHomePage
							? 'Home'
							: <Input
									name="title"
									value={this.state.title}
									onChange={ev =>
										this.setState({title: ev.target.value})}
									placeholder="Title"
									key="fhs"
								/>}
					</Heading>

					{!isHomePage &&
						<Paragraph>
							/
							<Input
								name="slug"
								value={this.state.slug}
								onChange={ev => this.setState({slug: ev.target.value})}
								placeholder="Page path"
								key="ffs"
							/>
						</Paragraph>}

					<Editor
						value={this.state.content.trim()}
						onChange={content => this.setState({content})}
						options={{toolbar: editorToolbar}}
					/>
				</Form>
			</main>
		);
	}
}
