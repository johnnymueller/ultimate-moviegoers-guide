import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.scss';

const App = () => (
  <Router>
    <div>
      <Header />

      <Route exact path="/" component={Dashboard} />
      <Route path="/time" component={Time} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

const Dashboard = () => <h2>Dashboard</h2>;
const Time = () => <h2>Time</h2>;
const Invoices = () => <h2>Invoices</h2>;
const Expenses = () => <h2>Expenses</h2>;
const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;
const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>

    <ul>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);
const Header = () => (
  <ul id="nav">
    <li>
      <Link to="/">Dashboard</Link>
    </li>
    <li>
      <Link to="/time">Time</Link>
    </li>
    <li>
      <Link to="/invoices">Invoices</Link>
    </li>
    <li>
      <Link to="/expenses">Expenses</Link>
    </li>
    <li>
      <Link to="/topics">Topics</Link>
    </li>
  </ul>
);

export default App;