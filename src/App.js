// TODO: back with search and state with search
// TODO: pagination
// TODO: rendering lists
// Improvements: type ahead, use multi-search for actors as well

import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MovieList from './MovieList'
import MovieItem from './MovieItem'
import queryString from 'query-string'
import './App.scss';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      imageConfig: {},
    };
  }

  componentDidMount() {
    // TODO: cache and check for updates every few days
    // get image configuration
    axios.get('https://api.themoviedb.org/3/configuration', {
        params: {
          api_key: '4268bd97bf4cfe10c3797b864eef07b8',
        }
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({imageConfig: response.data.images})
        } else {
          console.log('error!');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  setSearch = (search) => {
    this.setState({search: search})
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            render={(props) =>
              <Header {...props} search={this.state.search} setSearch={this.setSearch} />}
          />

          <Route
            // path={["/users/:id", "/filter/:type"]}
            path="/movies/:type"
            render={(props) => 
              <MovieList {...props} search={this.state.search} imageConfig={this.state.imageConfig} setSearch={this.setSearch} />}
          />

          <Route
            path="/movie/:id"
            render={(props) => 
              <MovieItem {...props} imageConfig={this.state.imageConfig} />}
          />

          <Footer />

        </div>
      </Router>
    )
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localSearch: '',
    };
  }

  componentDidMount() {
    const search = queryString.parse(this.props.location.search);
    // this.setState({search: search.query})
    this.props.setSearch(search.query);
    console.log(search);

  }

  componentDidUpdate(prevProps) {
    const searchChanged = this.props.search !== prevProps.search;
    if (searchChanged) {
      this.setState({localSearch: this.props.search})
    }
  }

  handleKey = (event) => {
    if (event.which === 13) {
      this.doSearch();
    }
  }

  handleInputChange = (event) => {
    this.setState({localSearch: event.target.value});
  }

  doSearch = () => {
    const history = this.props.history
    history.push('/movies/search?query=' + this.state.localSearch);
    this.props.setSearch(this.state.localSearch)
  }

  render() {
    return (
      <header>
        <h1>The Ultimate Moviegoers Guide</h1>

        <input
          placeholder="Search by Title"
          name="search"
          type="text"
          value={this.state.localSearch}
          onChange={this.handleInputChange}
          onKeyUp={this.handleKey}
        />
        <button onClick={() => this.doSearch()}>Search</button>
        <br />

        <Link to="/movies/popular">Popular</Link>
        <Link to="/movies/now-playing">Now Playing</Link>
        <Link to="/movies/top-rated">Top Rated</Link>

      </header>
    );
  }
}

const Footer = () => (
  <div>
    <img
      src="https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png"
      alt="TMDb Logo"
    />
  </div>
);

export default App;