import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StatsList extends Component {
  get stats() {
    const { active, data, onChange } = this.props;

    if (this.props.data === null) {
      return null;
    }

    return Object.entries(this.props.data)
      .map(([ key, { value, unit } ]) => (
        <li key={key} className={active === key ? 'active' : null}>
          <a
            href="#"
            onClick={() => onChange(key)}
          >
            <span className="name">{key}:</span>
            <span className="value">{value} {unit}</span>
          </a>
        </li>
      ));
  }

  render() {
    return (
      <ul className="stats-list">
        {this.stats}
      </ul>
    );
  }
}

StatsList.propTypes = {
  active: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
