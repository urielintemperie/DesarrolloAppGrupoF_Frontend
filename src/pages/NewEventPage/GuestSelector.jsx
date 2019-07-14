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
      value: [],
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleChange = (value) => {
    this.setState({ value });
  };

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    var guests = this.state.value.map((val) => val.value)
    if (!inputValue) return;
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        });
        this.props.form.setFieldValue('guests', guests.concat(inputValue))

    }

  };

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
          placeholder="Type your guests emails"
          value={value}
        />
      </Fragment>

    );
  }
}