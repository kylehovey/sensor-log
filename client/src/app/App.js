import React from 'react';
import io from 'socket.io-client';

const socket = io('/');

import '../style/App.css';
import '../style/style.css';
import StatsList from './components/stats_list';
import Chart from './components/chart';

import api from './util/api.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      active: 'pm25',
      backlog: [],
      units: '',
    };

    socket.on('data-point', data => this.withNewData(data));
  }

  activate(active) {
    this.setState({ active, backlog: [], units: '' });
  }

  withNewData(data) {
    const { [this.state.active]: reading } = data;

    document.title = `${reading.value} ${reading.unit}`;
    this.setState(({ backlog }) => ({
      data,
      backlog: [ ...backlog, reading.value ],
      units: reading.unit,
    }));
  }

  render() {
    const { active, data, backlog, units } = this.state;

    return (
      <div className="container">
        <div className="content">
          <div className="main">
            <div className="description">
              <h2>Tomahna Environment Statistics</h2>
            </div>
            <StatsList
              active={active}
              onChange={value => this.activate(value)}
              data={data}
            />
            <Chart title={active} values={backlog} units={units} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
