import * as ReactDOM from "react-dom";
import * as React from "react";
import {OpeneGovPractices} from "./app/OpeneGovPractices.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={OpeneGovPractices} path="/"/>
  </Router>
), document.getElementById('root'));
