// TODO: back with search and state with search
// TODO: pagination
// Improvements: type ahead, use multi-search for actors as well

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './Header'
import MovieList from './MovieList'
import MovieItem from './MovieItem'
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

const Footer = () => (
  <footer>
    <img
      src="https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-blue-10d3d41d2a0af9ebcb85f7fb62ffb6671c15ae8ea9bc82a2c6941f223143409e.png"
      alt="TMDb Logo"
    />
  </footer>
);

export default App;