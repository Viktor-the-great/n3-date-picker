import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';

import '@n3/date-picker/dist/n3-date-picker.css';

import App from './app';

render(
  <App/>,
  document.getElementById('app'),
);