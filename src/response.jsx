const React = require('react');
const _ = require('lodash');
const classNames = require('classnames');
const { Tabs, Tab, Table } = require('react-materialize');

function prettifyJson(obj) {
  return JSON.stringify(obj, null, 4);
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
    let responseBody = _.has(this.props.response, 'body') ? _.get(this.props.response, 'body') : this.props.response;
    let responseHeaders = _.get(this.props.response, 'headers');
    return (
        <div className={classNames({
          hidden: !responseBody && !responseHeaders
        })}>
          <Tabs>
              <Tab title="Body">
                <pre>
                  {prettifyJson(responseBody)}
                </pre>
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
