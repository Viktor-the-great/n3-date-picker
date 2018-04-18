import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.onChange = this.onChange.bind(this);
  }

  async onChange(event) {
    const value = event.target.value;

    await this.setState({
      value,
    });

    if(moment(value, this.props.format, true).isValid()) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <input type="text"
             className={ this.props.className }
             value={ this.state.value }
             onChange={ this.onChange }
      />
    )
  }
}

