const tsapi = require('@tradeshift/tradeshift-api');
const React = require('react');
const _ = require('lodash');
const { shell } = require('electron');
const { Input, Row, Button, Col } = require('react-materialize');
const { $ } = window;
const opn = require('opn');

module.exports = React.createClass({
  getInitialState() {
    let homeConfig = this.getOrCreateHomeConfig();
    return {
      isConfigValid: tsapi.isHomeConfigValid(),
      env: _.get(homeConfig, 'defaultEnvironment'),
      environments: _.get(homeConfig, 'environments') || []
    };
  },

  getOrCreateHomeConfig() {
    try {
      let homeConfig = tsapi.getHomeConfig();
      if (!homeConfig) {
        tsapi.createHomeConfig();
      }
      return homeConfig;
    } catch (e) {
      console.error(e);
    }
  },

  componentDidMount() {
    this.props.setEnv(this.state.env);
    document.querySelector('.environment .select-dropdown').value = this.state.env;

    if (!this.state.isConfigValid) {
      $('#homeconfig-error').openModal();
    }
  },

  onChange(event) {
    var env = event.target.value;
    this.setState({ env: env });
    this.props.setEnv(env);
  },

  openReadme() {
    shell.openExternal('https://github.com/Tradeshift/tradeshift-node-tsapi#configuration');
  },

  openConfigFile() {
    opn(tsapi.getHomeConfigPath()).then(() => {
      window.location.reload();
    });
  },

  render() {
    let environmentNodes = _.map(this.state.environments, (value, env) => <option key={env}>{env}</option>);

    return (
      <div>
          <Input s={3} type="select" className="environment" label="Environment" onChange={this.onChange}>
              {environmentNodes}
          </Input>
          <Input s={7} value={_.get(this.state.environments[this.state.env], 'host')} label="Host" disabled/>

          <div id="homeconfig-error" className="modal bottom-sheet">
            <div className="modal-content">
              <h4>.tsapi error</h4>
              <p className="red-text">Your .tsapi configuration is invalid. <a href="#" onClick={this.openConfigFile}>Click here</a> to edit it.</p>
              <p><a href="#" onClick={this.openReadme}>Read more</a></p>
            </div>
            <div className="modal-footer">
              <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">OK</a>
            </div>
          </div>
      </div>
    );
  }
});
