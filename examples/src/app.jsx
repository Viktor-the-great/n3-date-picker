import React, { Component } from 'react';

import DatePicker from '@n3/date-picker';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      single: null,
      range: {
        from: null,
        to: null,
      },
    }
  }

  onSingleChange = (single) => {
    this.setState({
      single
    })
  };

  onRangeChange = (range) => {
    this.setState({
      range,
    })
  };

  render() {
    return (
      <div>
        <h1>React n3-date-picker examples</h1>

        <div>
          <h2>Single date-picker</h2>
          <div>
            <DatePicker
              value={ this.state.single }
              onChange={ this.onSingleChange }
            />
          </div>
        </div>

        <div>
          <h2>Range date-picker</h2>
          <div>
            <DatePicker
              value={ this.state.range }
              range
              onChange={ this.onRangeChange }
            />
          </div>
        </div>
      </div>
    )
  }
}


