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
      showAll: false,
      halt: false,
    };

    socket.on('data-point', data => this.withNewData(data));
  }

  activate(active) {
    this.setState({ active, units: '' });
    this.updateGlobalBacklog();
  }

  withNewData(data) {
    const { active, halt } = this.state;

    if (halt) {
      return;
    }

    const { [active]: reading } = data;

    document.title = `${reading.value} ${reading.unit}`;
    this.setState(({ backlog }) => ({
      data,
      backlog: [ ...backlog, reading.value ],
      units: reading.unit,
    }));
  }

  updateGlobalBacklog() {
    const { showAll, active } = this.state;

    if (showAll) {
      api.allData().then(allData => {
        this.setState({
          backlog: allData.map(({
            [active]: { value }
          }) => value),
          halt: false,
        });
      });
    } else {
      this.setState({ backlog: [] });
    }
  }

  changeShow(showAll) {
    this.setState({ showAll, halt: showAll }, () => {
      this.updateGlobalBacklog();
    });
  }

  render() {
    const { active, data, backlog, units, showAll } = this.state;

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
            <label htmlFor="show-all">Show All Data</label>
            <input
              type="checkbox"
              checked={showAll}
              onChange={({ target: { checked }}) => this.changeShow(checked)}
              id="show-all"
            />
            <Chart title={active} values={backlog} units={units} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
