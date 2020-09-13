import React from 'react';
import io from 'socket.io-client';

const socket = io('/');

import '../style/App.css';
import Basic from './components/basic/basic';

import api from './util/api.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: null, active: 'humidity' };

    socket.on('data-point', data => this.withNewData(data));
  }

  activate(active) {
    this.setState({ active });
  }

  withNewData(data) {
    const { [this.state.active]: reading } = data;

    document.title = `${reading.value} ${reading.unit}`;
    this.setState({ data });
  }

  isActive(key) {
    return this.state.active === key;
  }

  get stats() {
    if (this.state.data === null) {
      return null;
    }

    return Object.entries(this.state.data)
      .map(([ key, { value, unit } ]) => (
        <li key={key} className={this.isActive(key) ? 'active' : null}>
          <a
            href="#"
            onClick={() => this.activate(key)}
          >
            <span className="name">{key}:</span>
            <span className="value">{value} {unit}</span>
          </a>
        </li>
      ));
  }

  render() {
    return (
      <div className="container">
        <div className="content">
          <div className="main">
            <div className="description">
              <h2>Tomahna Environment Statistics</h2>
            </div>
            <ul className="stats-list">
              {this.stats}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
