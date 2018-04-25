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
      position: moment(this.selected).startOf('month'),
    };

    this.onSingleChange = this.onSingleChange.bind(this);
    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.isBordered = this.isBordered.bind(this);
    this.onYearsScroll = this.onYearsScroll.bind(this);
  }

  setMonthsRef = el => this._months = el;
  setMonth1Ref = el => this._firstMonth = el;
  setMonth2Ref = el => this._prevMonth = el;
  setMonth3Ref = el => this._currentMonth = el;
  setMonth4Ref = el => this._nextMonth = el;
  setMonth5Ref = el => this._lastMonth = el;

  componentDidMount() {
    this._marginTop = -this._currentMonth.offsetTop;
    this._months.style.marginTop = `${ this._marginTop }px`;
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

  isCurrentMonth(month) {
    return this.state.current.isSame(this.state.selected, 'year') && this.state.current.month() === month;
  }

  isSelectedMonth(month) {
    return this.state.selected.month() === month;
  }

  onDaysScroll = async ({ currentTarget, deltaY }) => {
    const months = this.months;
    const start = months[0];
    const end = months[months.length - 1];
    const totalDays = end.diff(start, 'days') + 1;
    const days = totalDays / (currentTarget.clientHeight / this.props.speed);
    const prevMonth = moment(this.state.selected);
    const firstMonthHeight = this._firstMonth.clientHeight;


    await this.setState(state => ({
      selected: deltaY > 0 ? state.selected.add(days, 'day') : state.selected.subtract(days, 'day')
    }));

    if (prevMonth.isSame(this.state.selected, 'month')) {
      this._marginTop = deltaY > 0 ? this._marginTop - this.props.speed : this._marginTop + this.props.speed;
    } else if (prevMonth.isAfter(this.state.selected, 'month')) {
      this._marginTop = this._marginTop - this._firstMonth.clientHeight + this.props.speed;
    } else {
      this._marginTop = this._marginTop + firstMonthHeight - this.props.speed;
    }

    currentTarget.style.marginTop = `${ this._marginTop }px`;
  };

  onMonthsScroll = ({ deltaY }) => {
    this.setState(state => ({
      selected: deltaY > 0 ? state.selected.subtract(1, 'month') : state.selected.add(1, 'month')
    }))
  };

  onYearsScroll = ({ deltaY }) => {
    this.setState(state => ({
      selected: deltaY > 0 ? state.selected.subtract(1, 'year') : state.selected.add(1, 'year')
    }))
  };

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
      <div className="n3__date-picker__calendar">
        <div className="n3__date-picker__calendar-inputs">
          {
            range ? (
              <div>
                <Input
                  value={ from }
                  onChange={ this.onFromChange }
                  className="n3__date-picker__calendar-input"
                />

                <div className="n3__date-picker__calendar-dash">
                  &mdash;
                </div>

                <Input
                  value={ to }
                  onChange={ this.onToChange }
                  className="n3__date-picker__calendar-input"
                />
              </div>
            ) : (
              <Input
                value={ value }
                onChange={ this.onSingleChange }
                className="n3__date-picker__calendar-input"
              />
            )
          }
        </div>

        <div className="n3__date-picker__calendar-weekdays">
          {
            weekdays.map((weekday, i) => (
              <span
                key={ i }
                className={ cx('n3__date-picker__calendar-day', {
                  'n3__date-picker__calendar-day_weekend': isWeekend(weekday),
                }) }
              >
                { weekday }
              </span>
            ))
          }
        </div>


        <div className="n3__date-picker__calendar-block">
          <div className="n3__date-picker__calendar-months"
               onWheel={ this.onDaysScroll }
               ref={ this.setMonthsRef }
          >
            {
              this.months.map((month, i) => (
                <div key={ i } ref={ this[`setMonth${ i + 1 }Ref`] }>
                  <Month
                    month={ month }
                    isSelected={ this.isSelected }
                    isBordered={ this.isBordered }
                    onClick={ onChange }
                  />
                </div>
              ))
            }
          </div>
          <div className="n3__date-picker__calendar-month-labels"
               onWheel={ this.onMonthsScroll }
          >
            {
              monthLabels.map((month, i) => (
                <div
                  key={ i }
                  className={ cx('n3__date-picker__calendar-month-label', {
                    'n3__date-picker__calendar-month-label_current': this.isCurrentMonth(i),
                    'n3__date-picker__calendar-month-label_selected': this.isSelectedMonth(i),
                  }) }
                >
                  { month }
                </div>
              ))
            }
          </div>
          <div className="n3__date-picker__calendar-years"
               onWheel={ this.onYearsScroll }
          >
            {
              this.years.map((year, i) => (
                <div
                  key={ i }
                  className={ cx('n3__date-picker__calendar-year', {
                    'n3__date-picker__calendar-year_current': this.state.current.year() === year,
                    'n3__date-picker__calendar-year_selected': this.state.selected.year() === year,
                  }) }
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

  speed: PropTypes.number,

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

  speed: 20,

  range: false,
  formats: null,
};
