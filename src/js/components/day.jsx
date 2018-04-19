import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import cx from 'classnames';

export default class Day extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.props.day) {
      return;
    }

    this.props.onClick(this.props.day);
  }

  render() {
    const {
      day,
      isSelected,
      isBordered,
    } = this.props;

    return (
      <button
        className={cx('n3__date-picker-day', {
          'n3__date-picker-day_empty': !day,
          'n3__date-picker-day_current': moment().isSame(day, 'day'),
          'n3__date-picker-day_selected': isSelected,
          'n3__date-picker-day_bordered': isBordered,
        })}
        onClick={this.onClick}
      >
        {
          day && (
            <span className="n3__date-picker-day-label">{ day.date() }</span>
          )
        }
      </button>
    );
  }
}

Day.propTypes = {
  day: momentPropTypes.momentObj.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isBordered: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
