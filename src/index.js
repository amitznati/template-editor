import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import EditTemplateMainView from './widgets/EditTemplateMainView/widget/EditTemplateMainView.connect';
import * as serviceWorker from './serviceWorker';
import {getStoreInstance} from './sdk';

const store = getStoreInstance();
render(
	<Provider store={store}>
		<EditTemplateMainView />
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
