import { createGlobalStyle } from 'styled-components';
import theme from './theme';

export default createGlobalStyle`
  html, body {
    overscroll-behavior-x: none;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    
  }

  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    user-select: none; 
  
  }

  body {
    font-family: "Industry", "Nunito", "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-text-stroke: 0;
    background: ${theme.color.background};
    
  }

  a,
  button {
    outline: none;
    border: none;
    background: transparent;
    text-decoration: none;
    color: ${theme.color.primary};
  }

  h1, h2, h3, h4, h5 {
    font-family: ${({ theme }) => theme.font.industry};
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :focus {
    outline: ${({ wasKeypadUsed }) =>
      wasKeypadUsed ? `6px solid orange` : 'none'};
  }


  @font-face {
    font-family: 'Industry';
    src: url(${require(`../assets/fonts/Industry-Medium.woff`)}) format('woff');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Industry';
    src: url(${require(`../assets/fonts/Industry-BookItalic.woff`)}) format('woff');
    font-weight: normal;
    font-style: italic;
  }
  @font-face {
    font-family: 'Industry';
    src: url(${require(`../assets/fonts/Industry-Book.woff`)}) format('woff');
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: 'Industry';
    src: url(${require(`../assets/fonts/Industry-Demi.woff`)}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Nunito';
    src: url(${require(`../assets/fonts/Nunito-Regular.woff`)}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
  

`;
