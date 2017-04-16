import Document, { Head, Main, NextScript } from 'next/document';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import {injectGlobal} from 'styled-components';
import {baseSize} from '../components/type-scale';
import {teal} from '@quarterto/colours';
import {transparentize} from 'polished';

const setOpacity = (o, c) => transparentize(1 - o, c);

injectGlobal`
* { box-sizing: border-box }

:root {
	font-size: ${baseSize}px;
}

:root.show-grid {
	position: relative;
}

:root.show-grid::after {
	pointer-events: none;
	content: '';
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-image: repeating-linear-gradient(
		transparent,
		transparent 1rem,
		${setOpacity(0.3, teal[3])} 1rem,
		${setOpacity(0.3, teal[3])} 2rem
	);
}

body {
	margin: 0;
}
`;

export default class MyDocument extends Document {
	static async getInitialProps ({ renderPage }) {
		const page = renderPage()
		const styles = (
			<style dangerouslySetInnerHTML={{ __html: styleSheet.rules().map(rule => rule.cssText).join('\n') }} />
		);
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
