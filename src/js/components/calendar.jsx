import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

import Input from './date-input';

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: moment(),
      selected: this.getSelected(props),
    };

    this.onSingleChange = this.onSingleChange.bind(this);
    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
  }

  onSingleChange(value) {
    this.props.onChange(value);
  }

  onFromChange(value) {
    this.props.onChange({ ...this.props.value, from: value })
  }

  onToChange(value) {
    this.props.onChange({ ...this.props.value, to: value });
  }

  getSelected(props) {
    if (!props.range) {
      return props.value ? moment(props.value, props.formats, true) : moment();
    }

    if (props.from) {
      return moment(props.from, props.formats, true);
    }

    if (props.to) {
      return moment(props.to, props.formats, true);
    }

    return moment();
  }

  render() {
    const {
      range,
    } = this.props;

    const weekdays = moment.weekdaysMin(true);
    const months = moment.monthsShort();

    return (
      <div className='n3__date-picker-menu'>
        <div className='n3__date-picker-inputs'>
          {
            range ? (
              <Input value={ this.state.value }
                     onChange={ this.onSingleChange }
                     className='n3__date-picker-input'
              />
            ) : (
              <div>
                <Input value={ this.state.value.from }
                       onChange={ this.onFromChange }
                       className='n3__date-picker-input'
                />

                <div className='n3__date-picker-dash'>
                  &mdash;
                </div>

                <Input value={ this.state.value.to }
                       onChange={ this.onToChange }
                       className='n3__date-picker-input'
                />
              </div>
            )
          }
        </div>

        <div className='n3__date-picker-calendar'>
          <div className='n3__date-picker-weekdays'>
            {
              weekdays.map((weekday, i) => (
                <span key={ i } className='n3__date-picker-weekday'>
                  { weekday }
                </span>
              ))
            }
          </div>
          <div>
            <div className='n3__date-picker-days'></div>
            <div className='n3__date-picker-months'>
              {
                months.map((month, i) => (
                  <div key={ i } className={ cx('n3__date-picker-month', {
                    'n3__date-picker-month_current': this.state.current.isSame(month, 'month'),
                    'n3__date-picker-month_selected': this.state.selected.isSame(month, 'month'),
                  }) }>
                    { month }
                  </div>
                ))
              }
            </div>
            <div className='n3__date-picker-years'>
              {
                [
                  ...Array.from({ length: 6 }, (item, i, list) => selected.year() - (list.length - i)),
                  selected.year(),
                  ...Array.from({ length: 7 }, (item, i, list) => selected.year() + i + 1),
                ].map((year, i) => (
                  <div key={ i } className={ cx('n3__date-picker-year', {
                    'n3__date-picker-year_current': this.state.current.isSame(year, 'year'),
                    'n3__date-picker-year_selected': this.state.selected.isSame(year, 'year'),
                  }) }>
                    year
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}