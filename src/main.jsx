const React = require('react');
const tsapi = require('@tradeshift/tradeshift-api');
const { Input, Row, Button, Col, ProgressBar, Tabs, Tab, Table } = require('react-materialize');
const urlParser = require('url');
const _ = require('lodash');
const classNames = require('classnames');
const QueryPairs = require('./queryPairs');
const Response = require('./response');

module.exports = React.createClass({
  getInitialState() {
    let homeConfig = tsapi.getHomeConfig();
    return {
      settings: {
        displayQueryContainer: false
      },
      queryPairs: [],
      isLoading: false,
      response: null,
      request: {
        env: homeConfig.defaultEnvironment,
        url: 'account/info',
        method: 'GET'
      }
    };
  },

  onClickParamToggle() {
    this.state.settings.displayQueryContainer = !this.state.settings.displayQueryContainer;
    this.setState({ settings: this.state.settings });
  },

  onEnvChange(event) {
    this.state.request.env = event.target.value;
    this.setState({ request: this.state.request });
  },

  onMethodChange(event) {
    this.state.request.method = event.target.value;
    this.setState({ request: this.state.request });
  },

  onUrlChange(event) {
    let url = event.target.value;
    this.state.request.url = url;
    this.setState({ request: this.state.request });
  },

  onQueryPairsChange(url) {
    this.state.request.url = url;
    this.setState({ request: this.state.request });
  },

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
      response: null,
    });

    tsapi.send(this.state.request.url, this.state.request)
        .then(res => this.setState({ response: res }))
        .catch(res => this.setState({ response: res }))
        .finally(() => this.setState({ isLoading: false }));
  },

  render() {
    let requestMethodNodes = ['GET', 'POST', 'PUT', 'DELETE'].map(method => {
      return <option key={method}>{method}</option>;
    });

    let homeConfig = tsapi.getHomeConfig();
    let environmentNodes = Object.keys(homeConfig.environments).map(env => {
      return <option key={env}>{env}</option>;
    });

    let loadingNode = this.state.isLoading ? <Col s={12}><ProgressBar /></Col> : null;

    return (
        <div className="main-container">
            <form className="request-container grey lighten-5" onSubmit={this.onSubmit}>
                <Row>
                    <Input s={3} type='select' label="Method" onChange={this.onMethodChange}>
                        {requestMethodNodes}
                    </Input>
                    <Input s={7} label="Request URL" onChange={this.onUrlChange} value={this.state.request.url}/>
                    <Col s={2} className="query-container-toggle-button">
                        <Button
                            onClick={this.onClickParamToggle}
                            className={
                                classNames('grey', 'black-text', {
                                    'lighten-3': this.state.settings.displayQueryContainer,
                                    'lighten-2': !this.state.settings.displayQueryContainer
                                })
                            }
                            type="button">
                            Params
                        </Button>
                    </Col>
                </Row>

                <QueryPairs
                  url={this.state.request.url}
                  onChange={this.onQueryPairsChange}
                  className={classNames('query-container',{
                    hidden: !this.state.settings.displayQueryContainer
                  })}/>

                <Row>
                    <Input s={3} type='select' label="Environment" onChange={this.onEnvChange}>
                        {environmentNodes}
                    </Input>
                    <Input s={7} value={homeConfig.environments[this.state.request.env].host} label="Host" disabled/>
                    <Col s={2} className="send-button">
                        <Button type="submit" waves='light'>Send</Button>
                    </Col>
                </Row>
            </form>
            {loadingNode}

            <Row className="response-container">
              <Response response={this.state.response}/>
            </Row>
        </div>
    );
  }
});
