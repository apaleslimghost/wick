import Document, {Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components'
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
	render () {
		const sheet = new ServerStyleSheet();
		const main = sheet.collectStyles(<Main />);
		const styleTags = sheet.getStyleElement();

		return <html>
			<Head>
				<title>My page</title>
				{styleTags}
				<link href='https://fonts.googleapis.com/css?family=Merriweather+Sans:300,300i,700,700i|Merriweather:900' rel='stylesheet' />
			</Head>
			<body>
				{main}
				<NextScript />
			</body>
		</html>;
	}
}
