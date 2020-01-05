import React from 'react';
import '../style/App.css';
import Basic from './components/basic/basic';

import api from './util/api.js';

window.api = api;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Basic />
      </div>
    );
  }
}

export default App;
