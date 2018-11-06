// TODO: test on safari, ie, edge, win chrome, firefox (both)
// TODO: missing data for item view

import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from './Header'
import MovieList from './MovieList'
import MovieItem from './MovieItem'
import './App.scss';
import Api from './Api'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageConfig: {},
    };
  }

  componentDidMount() {
    // get image configuration
    Api('configuration')
    .then((response) => {
      this.setState({imageConfig: response.data.images})
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  render() {
    return (
      <Router>
        <div>
          <Route component={Header} />

          <Route
            // path={["/users/:id", "/filter/:type"]}
            path="/:type"
            render={(props) => 
              <MovieList {...props} imageConfig={this.state.imageConfig} />}
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
)

export default App