const React = require('react');
const tsapi = require('@tradeshift/tradeshift-api');
const {Input, Row, Button, Col, ProgressBar} = require('react-materialize');
const urlParser = require('url');
const _ = require('lodash');

module.exports = React.createClass({
    getInitialState: function() {
        let homeConfig = tsapi.getHomeConfig();
        return {
            isLoading: false,
            response: null,
            responseError: null,
            request: {
                env: homeConfig.defaultEnvironment,
                url: '',
                method: 'GET'
            }
        };
    },
    onQueryChange: function(i, type, event) {
        if (type === 'key') {
            this.state.query[i][0] = event.target.value;
        } else {
            this.state.query[i][1] = event.target.value;
        }

        // _.set(this.state.query[i], type === 'key' ? 0 : 1, event.target.value)

        let parsedUrl = urlParser.parse(this.state.request.url, true);
        this.state.request.url = urlParser.format({
            query: _.fromPairs(this.state.query),
            pathname: parsedUrl.pathname
        });

        this.setState({
            request: this.state.request,
            query: this.state.query
        });
    },
    onEnvChange: function(event) {
        this.state.request.env = event.target.value;
        this.setState({ request: this.state.request});
    },
    onMethodChange: function(event) {
        this.state.request.method = event.target.value;
        this.setState({ request: this.state.request});
    },
    onUrlChange: function(event) {
        let url = event.target.value;
        this.state.request.url = url;

        this.setState({
            request: this.state.request,
            query: _.toPairs(urlParser.parse(url, true).query)
        });

        setTimeout(Materialize.updateTextFields);
    },
    onSubmit: function(event) {
        event.preventDefault();
        this.setState({isLoading: true});

        tsapi.send(this.state.request.url, this.state.request)
            .then(res => this.setState({response: res}))
            .catch(res => this.setState({responseError: res}))
            .finally(() => this.setState({isLoading: false}));
    },
    render: function() {
        let requestMethodNodes = ['GET', 'POST', 'PUT', 'DELETE'].map(method => {
            return <option key={method}>{method}</option>
        });

        let homeConfig = tsapi.getHomeConfig();
        let environmentNodes = Object.keys(homeConfig.environments).map(env => {
            return <option key={env}>{env}</option>
        });

        let queryNodes = _.map(this.state.query, (query, i) => {
            return (
                <Row key={i}>
                    <Input s={6} label="key" onChange={this.onQueryChange.bind(null, i, 'key')} value={query[0]}/>
                    <Input s={6} label="value" onChange={this.onQueryChange.bind(null, i, 'value')} value={query[1]}/>
                </Row>
            );
        })

        let loadingNode = this.state.isLoading ? <Col s={12}><ProgressBar /></Col> : null;

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <Row>
                        <Input s={4} type='select' label="Environment" onChange={this.onEnvChange}>
                            {environmentNodes}
                        </Input>
                    </Row>

                    <Row>
                        <Input s={4} type='select' label="Method" onChange={this.onMethodChange}>
                            {requestMethodNodes}
                        </Input>
                        <Input s={8} label="Request URL" onChange={this.onUrlChange} value={this.state.request.url}/>
                    </Row>

                    {queryNodes}
                    <Button type="submit" waves='light'>Send</Button>
                </form>
                {loadingNode}
                <Row>
                    {JSON.stringify(this.state.response)}
                </Row>
            </div>
        );
    }
});
