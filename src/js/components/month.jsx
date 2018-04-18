import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

class Day extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.props.day)
      return;

    this.props.onClick(this.props.day);
  }

  render() {
    const {
      day,
      selected,
      bordered,
    } = this.props.day;

    return (
      <div className={ cx('n3__date-picker-day', {
        'n3__date-picker-day_empty': !day,
        'n3__date-picker-day_current': moment().isSame(day, 'day'),
        'n3__date-picker-day_selected': selected,
        'n3__date-picker-day_bordered': bordered,
      }) }
           onClick={ this.onClick }
      >
        {
          day && (
            <span className='n3__date-picker-day-label'>{ day.date() }</span>
          )
        }
      </div>
    )
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  bordered: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default class Month extends Component {
  get days() {
    const start = this.props.month.startOf('month');
    const end = this.props.month.endOf('month');

    const days = [];
    while (end.isSameOrAfter(start)) {
      const week = Array.from({ length: 7 });
      week.forEach((item, i) => {
        const current = moment(start);

        if (current.day() === i) {
          start.add(1, 'day');
          return start;
        }

        return null;
      });
      days.push(week);
    }

    return days;
  }

  getSelected(day) {
    if (this.props.range) {
      if (!this.props.value.from && !this.props.value.to)
        return false;

      if (!this.props.value.from)
        return moment(this.props.value.to, this.props.formats, true).isSame(day, 'day');

      if (!this.props.value.to)
        return moment(this.props.value.from, this.props.formats, true).isSame(day, 'day');

      return moment(this.props.value.to, this.props.formats, true).isSameOrBefore(day, 'day') &&
        moment(this.props.value.from, this.props.formats, true).isSameOrAfter(day, 'day');
    }

    return this.props.value ? moment(this.props.value, this.props.formats, true).isSame(day, 'day') : false
  }

  getBordered(day) {
    if (this.props.range) {
      if (this.props.value.from)
        return moment(this.props.value.from, this.props.formats, true).isSame(day, 'day');

      if (this.props.value.to)
        return moment(this.props.value.from, this.props.formats, true).isSame(day, 'day');

      return false;
    }

    return this.props.value ? moment(this.props.value, this.props.formats, true).isSame(day, 'day') : false
  }


  render() {
    const days = this.days;

    return (
      <div className='n3__date-picker-days-container'>
        {
          days.map((week, i) => (
            <div key={ i } className='n3__date-picker-days'>
              {
                week.map((day, j) => (
                  <Day key={ j }
                       day={ day }
                       selected={ this.getSelected(day) }
                       bordered={ this.getBordered(day) }
                       onClick={ this.props.onClick }
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
}

Month.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
  range: PropTypes.bool.isRequired,
  formats: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  month: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};