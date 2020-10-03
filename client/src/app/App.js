import React from 'react';
import io from 'socket.io-client';

const socket = io('/');

import '../style/App.css';
import StatsList from './components/stats_list';

import api from './util/api.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: null, active: 'pm25' };

    socket.on('data-point', data => this.withNewData(data));
  }

  withNewData(data) {
    const { [this.state.active]: reading } = data;

    document.title = `${reading.value} ${reading.unit}`;
    this.setState({ data });
  }

  render() {
    return (
      <div className="container">
        <div className="content">
          <div className="main">
            <div className="description">
              <h2>Tomahna Environment Statistics</h2>
            </div>
            <StatsList
              active={this.state.active}
              onChange={active => this.setState({ active })}
              data={this.state.data}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
