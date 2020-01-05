import React from 'react';
import io from 'socket.io-client';

const socket = io('/');

import '../style/App.css';
import Basic from './components/basic/basic';

import api from './util/api.js';

window.api = api;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: null };

    socket.on('data-point', data => this.withNewData(data));
  }

  withNewData(data) {
    const { humidity: reading } = data;

    document.title = `${reading.value} ${reading.unit}`;

    this.setState({ data });
  }

  get stats() {
    if (this.state.data === null) {
      return null;
    }

    return (
      <div>
        {
          Object
            .entries(this.state.data)
            .map(([ key, { value, unit } ]) => (
              <p key={key}>{key}: {value} {unit}</p>
            ))
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Tomahna Environment Statistics</h1>
        {this.stats}
      </div>
    );
  }
}

export default App;
