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

  get stats() {
    if (this.state.data === null) {
      return null;
    }

    const isActive = key => this.state.active === key;

    return (
      <div>
        {
          Object
            .entries(this.state.data)
            .map(([ key, { value, unit } ]) => (
              <p key={key} className={isActive(key) ? 'active' : null}>
                <a
                  href="#"
                  onClick={() => this.activate(key)}
                >{isActive(key) ? '🔥' : '❄️'}</a>
                {key}: {value} {unit}
              </p>
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
