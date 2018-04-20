import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

import DefaultCalendar from './components/calendar';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
    };
  }

  onToggle = () => {
    this.setState((state) => ({
      opened: !state.opened,
    }));
  };

  onBlur = ({ currentTarget }) => {
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          opened: false,
        });
      }
    });
  };

  onClear = (event) => {
    event.stopPropagation();

    this.props.onChange(
      this.props.range ? { from: null, to: null } : null,
    );
  };

  get isClearable() {
    if (!this.props.clear) { return false; }

    if (this.props.range) { return Boolean(this.props.to || this.props.from); }

    return Boolean(this.props.value);
  }

  render() {
    const {
      range,
      formats,
      format,
    } = this.props;

    const Calendar = this.props.calendar;
    const value = this.props.value ? moment(this.props.value, formats, true).format(format) : '';
    const from = this.props.from ? moment(this.props.from, formats, true).format(format) : '';
    const to = this.props.to ? moment(this.props.to, formats, true).format(format) : '';

    return (
      <div
        role="presentation"
        tabIndex={-1}
        onBlur={this.onBlur}
        className="n3__date-picker"
      >
        <div
          role="button"
          tabIndex={-1}
          className='n3__date-picker__field'
          onClick={this.onToggle}
          onKeyDown={this.onToggle}
        >

          <div className="n3__date-picker__field-labels">
            {
              range ? (
                <Fragment>
                  <div className="n3__date-picker__field-label">{ from }</div>

                  {
                    to && (
                      <Fragment>
                        <div className="n3__date-picker__field-dash">
                          &mdash;
                        </div>

                        <div className="n3__date-picker__field-label">{ to }</div>
                      </Fragment>
                    )
                  }
                </Fragment>
              ) : (
                <span>{ value }</span>
              )
            }
          </div>


          {
            this.isClearable && (
              <button
                type="button"
                className="n3__date-picker__field-clear"
                onClick={this.onClear}
              >
                <i className="fa fa-close" />
              </button>
            )
          }

          <div className='n3__date-picker__field-calendar'>
            <i className="fa fa-calendar-o" />
          </div>
        </div>
        {
          this.state.opened && (
            <Calendar { ...this.props }/>
          )
        }
      </div>
    );
  }
}

DatePicker.propTypes = {
  value: momentPropTypes.momentString,

  from: momentPropTypes.momentString,
  to: momentPropTypes.momentString,

  formats: PropTypes.arrayOf(
    PropTypes.string,
  ),
  format: PropTypes.string,
  range: PropTypes.bool,
  clear: PropTypes.bool,

  onChange: PropTypes.func.isRequired,

  calendar: PropTypes.element,
};

DatePicker.defaultProps = {
  value: null,
  from: null,
  to: null,
  format: 'DD.MM.YYYY',
  calendar: DefaultCalendar,
  formats: null,
  range: false,
  clear: false,
};
