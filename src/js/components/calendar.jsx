import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import cx from 'classnames';

import Input from './date-input';
import Month from './month';
import { isWeekend } from './utils';

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: moment(),
      selected: this.selected,
    };

    this.onSingleChange = this.onSingleChange.bind(this);
    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.isBordered = this.isBordered.bind(this);
  }

  onSingleChange(value) {
    this.props.onChange(value);
  }

  onFromChange(value) {
    this.props.onChange({ from: value, to: this.props.to });
  }

  onToChange(value) {
    this.props.onChange({ from: this.props.from, to: value });
  }

  get selected() {
    if (!this.props.range) {
      return this.props.value ? moment(this.props.value, this.props.formats, true) : moment();
    }

    if (this.props.from) {
      return moment(this.props.from, this.props.formats, true);
    }

    if (this.props.to) {
      return moment(this.props.to, this.props.formats, true);
    }

    return moment();
  }

  get months() {
    const start = moment(this.state.selected).subtract(2, 'month');
    const end = moment(this.state.selected).add(2, 'month');

    const months = [];
    while (end.isSameOrAfter(start)) {
      months.push(moment(start));
      start.add(1, 'month');
    }

    return months;
  }

  get years() {
    const start = this.state.selected.year() - 6;

    return Array.from({ length: 14 }, (item, i) => start + i);
  }

  isSelected(day) {
    if (this.props.range) {
      if (!this.props.from && !this.props.to) {
        return false;
      }

      if (!this.props.from) {
        return moment(this.props.to, this.props.formats, true).isSame(day, 'day');
      }

      if (!this.props.to) {
        return moment(this.props.from, this.props.formats, true).isSame(day, 'day');
      }

      return moment(this.props.to, this.props.formats, true).isSameOrBefore(day, 'day') &&
        moment(this.props.from, this.props.formats, true).isSameOrAfter(day, 'day');
    }

    return this.props.value ? moment(this.props.value, this.props.formats, true).isSame(day, 'day') : false;
  }

  isBordered(day) {
    if (this.props.range) {
      if (this.props.from) {
        return moment(this.props.from, this.props.formats, true).isSame(day, 'day');
      }

      if (this.props.to) {
        return moment(this.props.from, this.props.formats, true).isSame(day, 'day');
      }

      return false;
    }

    return this.props.value ? moment(this.props.value, this.props.formats, true).isSame(day, 'day') : false;
  }

  render() {
    const {
      value,
      from,
      to,

      range,
      onChange,
    } = this.props;

    const weekdays = moment.weekdaysMin(true);
    const monthLabels = moment.monthsShort();

    return (
      <div className="n3__date-picker__menu">
        <div className="n3__date-picker__menu-inputs">
          {
            range ? (
              <div>
                <Input
                  value={from}
                  onChange={this.onFromChange}
                  className="n3__date-picker__menu-input"
                />

                <div className="n3__date-picker__menu-dash">
                  &mdash;
                </div>

                <Input
                  value={to}
                  onChange={this.onToChange}
                  className="n3__date-picker__menu-input"
                />
              </div>
            ) : (
              <Input
                value={value}
                onChange={this.onSingleChange}
                className="n3__date-picker__menu-input"
              />
            )
          }
        </div>

        <div className="n3__date-picker__menu-weekdays">
          {
            weekdays.map((weekday, i) => (
              <span
                key={i}
                className={cx('n3__date-picker__menu-day', {
                'n3__date-picker__menu-day_weekend': isWeekend(weekday),
              })}
              >
                { weekday }
              </span>
            ))
          }
        </div>


        <div className="n3__date-picker__menu-calendar">
          <div className="n3__date-picker-months">
            {
              this.months.map((month, i) => (
                <div key={i} className="n3__date-picker-month">
                  { /* <Month */ }
                  { /* month={month} */ }
                  { /* isSelected={this.isSelected} */ }
                  { /* isBordered={this.isBordered} */ }
                  { /* onClick={onChange} */ }
                  { /* /> */ }
                </div>
              ))
            }
          </div>
          <div className="n3__date-picker-month-labels">
            {
              monthLabels.map((month, i) => (
                <div
                  key={i}
                  className={cx('n3__date-picker-month-label', {
                    'n3__date-picker-month-label_current': this.state.current.isSame(month, 'month'),
                    'n3__date-picker-month-label_selected': this.state.selected.isSame(month, 'month'),
                  })}
                >
                  { month }
                </div>
              ))
            }
          </div>
          <div className="n3__date-picker-years">
            {
                this.years.map((year, i) => (
                  <div
                    key={i}
                    className={cx('n3__date-picker-year', {
                      'n3__date-picker-year_current': this.state.current.isSame(year, 'year'),
                      'n3__date-picker-year_selected': this.state.selected.isSame(year, 'year'),
                    })}
                  >
                    { year }
                  </div>
                ))
              }
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  value: momentPropTypes.momentString,

  from: momentPropTypes.momentString,
  to: momentPropTypes.momentString,

  range: PropTypes.bool,
  formats: PropTypes.arrayOf(
    PropTypes.string,
  ),
  onChange: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  value: null,
  from: null,
  to: null,

  range: false,
  formats: null,
};
