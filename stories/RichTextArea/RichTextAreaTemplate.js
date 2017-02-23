import React, { Component, PropTypes } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import RichTextArea from '../../src/RichTextArea';

class RichTextAreaTemplate extends Component {
  componentDidUpdate(props) {
    props.onChange(reactElementToJSXString(this.getComponent()));
  }

  componentDidMount() {
    this.props.onChange(reactElementToJSXString(this.getComponent()));
  }

  handleChange = value => {
    console.log(value);
  };

  getComponent() {
    const props = {...this.props};
    delete props.onChange;

    return <RichTextArea onChange={this.handleChange} {...props}/>;
  }

  render() {
    return this.getComponent();
  }
}

RichTextAreaTemplate.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default RichTextAreaTemplate;
