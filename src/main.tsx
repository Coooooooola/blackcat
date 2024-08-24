import React from 'react';
import ReactDOM from 'react-dom';
import { AppPage } from './pages/App/App.page';
import { Provider } from 'react-redux';
import { store } from './redux/store.redux';
import './main.g.scss';

ReactDOM.render(
  <Provider store={store}>
    <AppPage />
  </Provider>,
  document.getElementById('root'),
);
