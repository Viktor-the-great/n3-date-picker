import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    const value = props.value || '';

    this.state = {
      value,
    };


    this.onChange = this.onChange.bind(this);
  }

  async onChange({ target: { value } }) {
    await this.setState({
      value,
    });

    if (moment(value, this.props.formats, true).isValid()) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <input
        type="text"
        className={this.props.className}
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}

DateInput.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  formats: PropTypes.arrayOf(
    PropTypes.string,
  ),
};

DateInput.defaultProps = {
  className: '',
  formats: null,
};

