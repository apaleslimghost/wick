import Document, { Head, Main, NextScript } from 'next/document';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import {injectGlobal} from 'styled-components';

injectGlobal`
:root {
	font-size: 16px;
	line-height: 1.6;
	font-family: 'Merriweather Sans', sans-serif;
}
`;

export default class MyDocument extends Document {
	static async getInitialProps ({ renderPage }) {
		const page = renderPage()
		const styles = (
			<style dangerouslySetInnerHTML={{ __html: styleSheet.rules().map(rule => rule.cssText).join('\n') }} />
		)
		return { ...page, styles }
	}

  render () {
    return <html>
      <Head>
        <title>My page</title>
				<link href='https://fonts.googleapis.com/css?family=Merriweather+Sans:300,300i,700,700i|Merriweather:900' rel='stylesheet' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>;
  }
}
