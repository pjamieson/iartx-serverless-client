import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

// import bootstrap before our own styles so we can override bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

//registerServiceWorker();
