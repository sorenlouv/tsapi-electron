const React = require('react');
const urlParser = require('url');
const _ = require('lodash');
const { Row, Input } = require('react-materialize');

module.exports = React.createClass({
  getInitialState() {
    return {
      queryPairs: []
    };
  },

  componentDidMount() {
    this.setState({queryPairs: this.getQueryPairsFromUrl(this.props.url)});
    // setTimeout(Materialize.updateTextFields);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({queryPairs: this.getQueryPairsFromUrl(nextProps.url)});
  },

  onQueryPairsChange(i, type, event) {
    if (type === 'key') {
      this.state.queryPairs[i][0] = event.target.value;
    } else {
      this.state.queryPairs[i][1] = event.target.value;
    }

    // _.set(this.state.queryPairs[i], type === 'key' ? 0 : 1, event.target.value)
    let url = this.getUrlFromQueryPairs(this.state.queryPairs);
    this.setState({ queryPairs: this.getQueryPairsFromUrl(this.props.url) });
    this.props.onChange(url);
  },

  getUrlFromQueryPairs(queryPairs) {
    let query = _(queryPairs).filter(queryPair => (queryPair[0] || queryPair[1])).fromPairs().value();
    let currentUrl = urlParser.parse(this.props.url, true);
    return urlParser.format({
      query: query,
      pathname: currentUrl.pathname
    });
  },

  getQueryPairsFromUrl(url) {
    let queryPairs = _.toPairs(urlParser.parse(url, true).query);
    queryPairs.push(['', '']);
    return queryPairs;
  },

  render() {
    let queryPairNodes = _.map(this.state.queryPairs, (queryPair, i) => {
      return (
        <Row key={i}>
          <Input s={5} label="key" onChange={this.onQueryPairsChange.bind(null, i, 'key')} value={queryPair[0]}/>
          <Input s={5} label="value" onChange={this.onQueryPairsChange.bind(null, i, 'value')} value={queryPair[1]}/>
        </Row>
      );
    });

    return <div className={this.props.className}>{queryPairNodes}</div>;
  }
});
