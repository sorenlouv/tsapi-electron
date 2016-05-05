const React = require('react');
const { Input } = require('react-materialize');

module.exports = React.createClass({
  componentWillReceiveProps(nextProps) {
    document.querySelector('.request-method .select-dropdown').value = nextProps.method;
  },

  render() {
    return (
      <Input s={3} type="select" className="request-method" label="Method" onChange={this.props.onChange}>
        {
          (() => {
            return ['GET', 'POST', 'PUT', 'DELETE'].map(method => {
              return <option key={method}>{method}</option>;
            });
          })()
        }
      </Input>
    );
  }
});
