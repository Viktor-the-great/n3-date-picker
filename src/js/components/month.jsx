import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import Day from './day';

export default class Month extends PureComponent {
  get days() {
    const start = this.props.month.startOf('month');
    const end = this.props.month.endOf('month');

    const days = [];
    while (end.isSameOrAfter(start)) {
      const week = Array.from({ length: 7 });

      week.forEach((item, i) => {
        if (start.day() === i) {
          week[i] = moment(start);
          start.add(1, 'day');
        } else {
          week[i] = null;
        }
      });

      days.push(week);
    }

    return days;
  }

  render() {
    return (
      <div className="n3__date-picker-days-container">
        {
          this.days.map((week, i) => (
            <div key={i} className="n3__date-picker-days">
              {
                week.map((day, j) => (
                  <Day
                    key={j}
                    day={day}
                    isSelected={this.props.isSelected(day)}
                    isBordered={this.props.isBordered(day)}
                    onClick={this.props.onClick}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

Month.propTypes = {
  month: momentPropTypes.momentObj.isRequired,
  isSelected: PropTypes.func.isRequired,
  isBordered: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
