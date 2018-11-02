import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import queryString from 'query-string'
import './App.scss';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      nowPlaying: true,
      popular: false,
      topRated: false,
      message: '',
      currentPage: 0,
      totalPages: 0,
      imageConfig: {},
      movies: [],
      // totalResults: 0,
    };
  }

  componentDidMount() {
    // TODO: make api function
    // TODO: cache config
    // TODO: loaders for data and image
    // TODO: TMDb logo from config
    // Improvements: url filtering, offline (pwa), type ahead, use multi-search for actors as well
    axios.get('https://api.themoviedb.org/3/configuration', {
        params: {
          api_key: '4268bd97bf4cfe10c3797b864eef07b8',
        }
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.setState({imageConfig: response.data.images})
          console.log("Image config:")
          console.log(this.state.imageConfig)
        } else {
          console.log('error!');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });

    // highest rated: certification_country=US&certification=R&sort_by=vote_average.desc
    // in theater: /discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '4268bd97bf4cfe10c3797b864eef07b8',
          language: 'en-US',
          sort_by: 'popularity.desc',
          include_adult: false,
          include_video: false,
          // with_genres: 878,
          page: 1,
          // ID: 12345
        }
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.setState({movies: response.data.results})
          this.setState({currentPage: response.data.page})
          this.setState({totalPages: response.data.total_pages})
          this.setState({totalResults: response.data.total_results})
          console.log(this.state.movies)
        } else {
          console.log('error!');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  render() {
    return (
      <Router>
        <div>
          <Route component={Header} />

          <Route exact path="/" component={Dashboard} />
          <Route path="/topics" component={Topics} />

          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />

          <div className="message">{this.state.message}</div>
          
          <MovieList movies={this.state.movies} imageConfig={this.state.imageConfig} />

          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />

          <Footer />

        </div>
      </Router>
    )
  }
}

function MovieList(props) {
  const movies = props.movies;
  const imageConfig = props.imageConfig;
  const listItems = movies.map((movie) =>
    <li key={movie.id}>
      <img src={imageConfig.base_url + imageConfig.poster_sizes[0] + movie.poster_path} /><br />
      {movie.title}<br />
      Release Date: {movie.release_date}<br />
      Average Vote: {movie.vote_average} / 10<br />
      Popularity: {movie.popularity}<br />
      {movie.overview}<br />
    </li>
  );
  return (
    <ul className="movie-list">{listItems}</ul>
  );
}

const Dashboard = () => <h2>Dashboard</h2>;

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // search: '',
      // nowPlaying: true,
      // popular: false,
      // topRated: false,
      // message: '',
      // currentPage: 0,
      // totalPages: 0,
      // imageConfig: {},
      // movies: [],
      // // totalResults: 0,
    };
  }

  componentDidMount() {
    this.getMovies();
  }

  getMovies() {
    console.log('getting movies')
    // highest rated: certification_country=US&sort_by=vote_average.desc
    // in theater: primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22

    console.log(this.props.match.params.id)

    let params = {
      api_key: '4268bd97bf4cfe10c3797b864eef07b8',
      language: 'en-US',
      sort_by: 'popularity.desc', // popular
      include_adult: false,
      include_video: false,
      // with_genres: 878,
      page: 1,
      // ID: 12345
    }

    if (this.props.match.params.id == 'highest-rated') {
      params.certification_country = 'US';
      params.sort_by = 'vote_average.desc';
    }
    // if {

    // }

    axios.get('https://api.themoviedb.org/3/discover/movie', {params})
      .then((response) => {
        console.log('movies: ');
        console.log(response.data.results);
        if (response.status === 200) {
          this.setState({imageConfig: response.data.images})
          console.log("Image config:")
          console.log(this.state.imageConfig)
        } else {
          console.log('error!');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location;
    // console.log(locationChanged)

    if (locationChanged) {
      this.getMovies();
    }
  }

  render() {
    return (
      <h3>Requested Param: {this.props.match.params.id}</h3>
    );
  }
}

// const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;

// const Topics = ({ match }) => (
//   <div>
//     <h2>Topics</h2>

//     <ul>
//       <li>
//         <Link to={`${match.url}/components`}>Components</Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
//       </li>
//     </ul>

//     <Route path={`${match.path}/:id`} component={Topic} />
//     <Route
//       exact
//       path={match.path}
//       render={() => <h3>Please select a topic.</h3>}
//     />
//   </div>
// );

// function getMovies() {
//   console.log('got movies')
//   axios.get('https://api.themoviedb.org/3/discover/movie', {
//       params: {
//         api_key: '4268bd97bf4cfe10c3797b864eef07b8',
//         language: 'en-US',
//         sort_by: 'popularity.desc', // popular
//         include_adult: false,
//         include_video: false,
//         // with_genres: 878,
//         page: 1,
//         // ID: 12345
//       }
//     })
//     .then((response) => {
//       console.log(response);
//       if (response.status === 200) {
//         this.setState({imageConfig: response.data.images})
//         console.log("Image config:")
//         console.log(this.state.imageConfig)
//       } else {
//         console.log('error!');
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
//     .then(function () {
//       // always executed
//     });
// }

class Topics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // search: '',
      // nowPlaying: true,
      // popular: false,
      // topRated: false,
      // message: '',
      // currentPage: 0,
      // totalPages: 0,
      // imageConfig: {},
      // movies: [],
      // // totalResults: 0,
    };
  }

  render() {
    return (
      <div>
        <h2>Topics</h2>

        <ul>
          <li>
            <Link to={`${this.props.match.url}/popular`}>Popular</Link>
          </li>
          <li>
            <Link to={`${this.props.match.url}/highest-rated`}>Highest Rated</Link>
          </li>
        </ul>

        <Route path={`${this.props.match.path}/:id`} component={Topic} />
        <Route
          exact
          path={this.props.match.path}
          render={() => <h3>Please select a topic.</h3>}
        />
      </div>
    );
  }
}

class Pagination extends React.Component {
  render() {
    return (
      <div className="pagination">
        Page
        {this.props.currentPage > 1 &&
          <i className="fas fa-angle-left"></i>
        }
        {this.props.currentPage}
        {this.props.currentPage < this.props.totalPages &&
          <i className="fas fa-angle-right"></i>
        }
        of {this.props.totalPages}
      </div>
    );
  }
}
const Footer = () => (
  <div>
    <img src="https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png" />
  </div>
);
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      nowPlaying: true,
      popular: false,
      topRated: false,
      searchNow: false,
    };
  }

  componentDidMount() {
    const search = queryString.parse(this.props.location.search)
    this.setState({search: search.query})
  }

  handleInputChange = (event) => {
    console.log(this.props.location.search)
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  doSearch = () => {
    const history = this.props.history
    history.push('/search?query=' + this.state.search);
    // this.setState({
    //   searchNow: true
    // })
  }

  render() {
    // if (this.state.searchNow === true) {
    //   return <Redirect to='/dashboard' />
    // }

    return (
      <header>
        <h1>The Ultimate Moviegoers Guide</h1>
        <input
          placeholder="Search by Title"
          name="search"
          type="text"
          value={this.state.search}
          onChange={this.handleInputChange} />
        <button onClick={() => this.doSearch()}>Search</button>
        <br />
        <Link to="/now-playing">Now Playing</Link>
        <input
          name="nowPlaying"
          type="checkbox"
          checked={this.state.nowPlaying}
          onChange={this.handleInputChange} /> Now Playing
        <input
          name="popular"
          type="checkbox"
          checked={this.state.popular}
          onChange={this.handleInputChange} /> Popular
        <input
          name="topRated"
          type="checkbox"
          checked={this.state.topRated}
          onChange={this.handleInputChange} /> Top Rated

        <ul id="header">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>
      </header>
    );
  }
}

export default App;