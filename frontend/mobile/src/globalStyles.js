import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
    :root {
        --main-red-color: #FF4C4C;
        --main-orange-color:#FFB22C;
        --orange-op50-color:rgba(255, 178, 44, 0.50);
        --main-yellow-color:#ffde4d;
        --dark-blue-color:#2D4059;
        --bg-baige-color:#FFFCE3;
        --label-gray-color:##7A7D84;
        --chat-pink-color:#FF9393;
        
        --red-color-100: #CD3D64;
        --red-color-200: #A41C4E;
        
        --green-color-100: #09825D;
        --green-color-200: #0E6245;
        
        --white-color-100: #fff;
        --white-color-200: #f4f4f4;
        --white-color-300: #f7f7f7;
        
        --gray-color-100: #ddd;
        --gray-color-200: #C0C0C0;
        --gray-color-300: #b5b5b5;
        --gray-color-400:##697386
        
        --black-color-100:#3D3D3D;
        --black-color-200:#2C2C2E;
        --black-color-300:#000000;

        --font-size-title: 4rem;
        --font-size-large: 2.8rem;
        --font-size-medium: 2.2rem;
        --font-size-small: 2rem;
        --font-size-primary: 1.6rem;
    }

	// @font-face {
	// 	font-family: 'NotoSans';
	// 	src: local('NotoSans'), local('NotoSans');
	// 	font-style: normal;
	// }

    html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		box-sizing: border-box;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
		-webkit-text-size-adjust:none;
		width: 100%;
  	height: 100%;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
	html {
		font-size: 62.5%;
		font-family: 'NotoSans';
		overflow-x: hidden;
		width: 100%;
 	 	height: 100%;
	}
	img {
		width: 100%;
		height: 100%;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
  button {
    cursor: pointer;
  }

	* {
  -webkit-tap-highlight-color:rgba(255,255,255,0);
	user-select: none;
  -webkit-touch-callout: none;

}
`;

export default GlobalStyles;
