import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import reducers from './../reducers';
import Routes from '../Routes';
import NavBar from './NavBar';
import './App.css';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App container">
          <NavBar />
          <Routes />
        </div>
      </Provider>
    );
  }
}

export default App;
