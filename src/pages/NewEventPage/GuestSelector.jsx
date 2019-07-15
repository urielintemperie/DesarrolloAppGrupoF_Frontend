import React, { Component, Fragment } from 'react';

import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

export default class GuestSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      value: props.guests.length > 0 ? props.guests : []
    };

    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleChange = (value) => {
    if (value != null) {
      this.setState({ value });
      this.props.setFieldValue('guests', value.map(opt => opt.value))
    } else {
      this.setState({ value: [] })
    }
  }

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  }

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    var guests = this.state.value.map(opt => opt.value)
    if (!inputValue) return;
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        });
        this.props.setFieldValue('guests', guests.concat(inputValue))

        event.preventDefault();
    }
  }

  render() {
    const { inputValue, value } = this.state;
    return (
      <Fragment>
        <CreatableSelect
          components={components}
          inputValue={inputValue}
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Ingresa los emails de tus inivtados"
          value={value}
        />
      </Fragment>

    );
  }
}