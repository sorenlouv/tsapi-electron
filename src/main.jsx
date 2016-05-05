const React = require('react');
const tsapi = require('@tradeshift/tradeshift-api');
const { Input, Row, Button, Col, ProgressBar } = require('react-materialize');
const _ = require('lodash');
const classNames = require('classnames');
const QueryPairs = require('./components/queryPairs');
const Response = require('./components/response');
const Environment = require('./components/environment');
const RequestMethod = require('./components/requestMethod');
const apiEndpoints = require('./apiEndpoints.json');

module.exports = React.createClass({
  getInitialState() {
    return {
      settings: {
        displayQueryContainer: false
      },
      queryPairs: [],
      isLoading: false,
      response: null,
      env: null,
      request: {
        body: null,
        url: 'account/info',
        method: 'GET'
      }
    };
  },

  componentDidMount() {
    var that = this;
    new window.autoComplete({
      selector: '#request-url',
      minChars: 2,
      source: (term, suggest) => {
        term = term.toLowerCase();
        var matches = _(apiEndpoints)
          .filter(item => item.url.includes(term))
          .sortBy(function (match) {
            return match.url.length;
          })
          .value();

        suggest(matches);
      },

      onSelect: (event, term, item) => {
        that.state.request.url = term;
        that.state.request.method = item.getAttribute('data-method');
        that.setState({ request: that.state.request });
        event.preventDefault();
      },

      renderItem: (item, search) => {
        return '<div class="autocomplete-suggestion" data-val="' + item.url + '" data-method="' + item.method.toUpperCase() + '"><strong>' + item.method.toUpperCase() + '</strong> ' + item.url + '</div>';
      }
    });
  },

  onClickParamToggle() {
    this.state.settings.displayQueryContainer = !this.state.settings.displayQueryContainer;
    this.setState({ settings: this.state.settings });
  },

  onClickBodyToggle() {
    this.state.settings.displayBodyContainer = !this.state.settings.displayBodyContainer;
    this.setState({ settings: this.state.settings });
  },

  setEnvironment(env) {
    this.setState({ env: env });
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

  onRequestBodyChange(event) {
    this.state.request.body = event.target.value;
    this.setState({ request: this.state.request });
  },

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
      response: null
    });

    var tsOptions = {
      env: this.state.env
    };

    try {
      this.state.request.body = JSON.parse(this.state.request.body);
    } catch (e) {}

    tsapi.send(this.state.request.url, this.state.request, tsOptions)
        .then(res => this.setState({ response: res, responseError: null }))
        .catch(error => {
          if (!error.response) {
            window.$('#request-error').openModal();
          }

          this.setState({ response: null, responseError: error });
        })
        .finally(() => this.setState({ isLoading: false }));
  },

  render() {
    function getButtonStyles(isClicked) {
      return classNames('grey', 'lighten-3', 'black-text', {
        'z-depth-0': isClicked,
        'z-depth-2': !isClicked,
        pressed: isClicked
      });
    }

    return (
        <div className="main-container">
            <form className="request-container grey lighten-5" onSubmit={this.onSubmit}>
                <Row>
                    <RequestMethod method={this.state.request.method} onChange={this.onMethodChange}></RequestMethod>
                    <Input s={5} id="request-url" label="Request URL" onChange={this.onUrlChange} value={this.state.request.url}/>

                    <Col s={2} className="query-container-toggle-button">
                        <Button
                            onClick={this.onClickParamToggle}
                            className={getButtonStyles(this.state.settings.displayQueryContainer)}
                            type="button">
                            Params
                        </Button>
                    </Col>

                    <Col s={1} className="body-container-toggle-button">
                        <Button
                            onClick={this.onClickBodyToggle}
                            className={getButtonStyles(this.state.settings.displayBodyContainer)}
                            type="button">
                            Body
                        </Button>
                    </Col>
                </Row>

                <QueryPairs
                  url={this.state.request.url}
                  onChange={this.onQueryPairsChange}
                  className={classNames('query-container', {
                    hidden: !this.state.settings.displayQueryContainer
                  })}/>

                <Row
                  onChange={this.onRequestBodyChange}
                  className={classNames('request-body-container', {
                    hidden: !this.state.settings.displayBodyContainer
                  })}>
                  <Input s={10} type="textarea" label="Request body"/>
                </Row>

                <Row>
                  <Environment setEnv={this.setEnvironment}></Environment>
                  <Col s={2} className="send-button">
                      <Button type="submit" waves='light'>Send</Button>
                  </Col>
                </Row>
            </form>

            {this.state.isLoading ? <ProgressBar/> : null}

            <Row className="response-container">
              <Response response={this.state.response || _.get(this.state, 'responseError.response')}></Response>
            </Row>

            <div id="request-error" className="modal bottom-sheet">
              <div className="modal-content">
                <h4>Request error</h4>
                <p>{_.get(this.state, 'responseError.message')}</p>
              </div>
              <div className="modal-footer">
                <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">OK</a>
              </div>
            </div>
        </div>
    );
  }
});
