const React = require('react');
const _ = require('lodash');
const classNames = require('classnames');
const { Tabs, Tab, Table } = require('react-materialize');

function prettifyResponseBody(body) {
  if(_.isObject(body)) {
    return JSON.stringify(body, null, 4);
  } else {
    return body;
  }
}

module.exports = React.createClass({
  getInitialState() {
    return {};
  },

  componentWillReceiveProps() {
    this.initTabs();
  },

  initTabs() {
    window.$('ul.tabs').tabs();
  },

  render() {
    let responseHeaders = _.get(this.props.response, 'headers');
    let responseStatus = _.get(this.props.response, 'statusCode');
    let responseBody = _.get(this.props.response, 'body');

    return (
      <div className={(_.isEmpty(this.props.response) ? 'hidden' : '')}>
        <p className={"status-code " + (responseStatus < 400 ? 'success' : 'error')}>Status: {responseStatus}</p>
        <Tabs>
            <Tab title="Body">
              {
                (() => {
                  if (responseBody) {
                    return <pre>{prettifyResponseBody(responseBody)}</pre>
                  } else {
                    return <em>Empty response</em>
                  }
                })()
              }
            </Tab>
            <Tab title="Headers">
              {
                (function(){
                  if(!_.isEmpty(responseHeaders)) {
                    return (
                      <Table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Value</th>
                          </tr>
                        </thead>

                        <tbody>
                          {
                            _.map(responseHeaders, (value, name) => {
                              return (
                                <tr key={name}>
                                  <td>{name}</td>
                                  <td>{value}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </Table>
                    );
                  } else {
                    return <p>No headers to display</p>;
                  }
                })()
              }
            </Tab>
        </Tabs>
      </div>
    );
  }
});
