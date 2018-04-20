import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';

import '../../src/css/n3-date-picker.css';

import App from './app';

render(
  <App/>,
  document.getElementById('app'),
);