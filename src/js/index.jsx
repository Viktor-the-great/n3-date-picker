import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DefaultCalendar from './components/calendar';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
    }
  }

  onToggle = () => {
    this.setState(state => ({
      opened: !state.opened
    }))
  };

  onBlur = (e) => {
    const currentTarget = e.currentTarget;

    setTimeout(function () {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          opened: false,
        })
      }
    });
  };

  onClear = () => {
    this.props.onChange(
      this.props.range ? { from: null, to: null } : null
    );
  };

  render() {
    const {
      accepted_format,
      format,
      clear,
    } = this.props;

    const Calendar = this.props.calendar;
    const isClearable = clear && this.props.value !== null;
    const value = this.props.value ? moment(this.props.value, accepted_format, true).format(format) : '';

    return (
      <div tabIndex="1"
           onBlur={ this.onBlur }
           className='n3__date-picker'
      >
        <div onClick={ this.onToggle }>
          <div>{ value }</div>
          {
            isClearable && (
              <div onClick={ this.onClear }>
                <i className="fa fa-times"/>
              </div>
            )
          }

          <div>
            <i className='fa fa-calendar-o'/>
          </div>
        </div>
        {
          this.state.opened && (
            <Calendar
              { ...this.props }
            />
          )
        }
      </div>
    )
  }
}

DatePicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,

  accepted_format: PropTypes.arrayOf(
    PropTypes.string,
  ),
  format: PropTypes.string,
  range: PropTypes.bool,
  clear: PropTypes.bool,

  onChange: PropTypes.func.isRequired,

  calendar: PropTypes.element,
};

DatePicker.defaultProps = {
  format: 'DD.MM.YYYY',
  calendar: DefaultCalendar,
};