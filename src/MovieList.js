import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const axios = require('axios');

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      currentPage: 0,
      totalPages: 0,
      movies: [],
    };
  }

  componentDidMount() {
    this.getMovies();
  }

  getMovies() {
    console.log('getting movies')
    console.log(this.props.match)

    let destination = 'discover/movie';
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

    // top rated
    if (this.props.match.params.type === 'top-rated') {
      params.certification_country = 'US';
      params.sort_by = 'vote_average.desc';
    }
    // in theater: primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    if (this.props.match.params.type === 'now-playing') {
      destination = 'movie/now_playing'
      delete params.sort_by
      // params.primary_release_date = {
      //   gte: '',
      //   lte: '',
      // };
    }
    if (this.props.match.params.type === 'search') {
      destination = 'search/movie'
      console.log('search:')
      console.log(this.props)
      params.query = this.props.search
    } else {
      this.props.setSearch('')
    }

    axios.get('https://api.themoviedb.org/3/' + destination, {params})
      .then((response) => {
        console.log('movies: ');
        console.log(response.data.results);
        if (response.status === 200) {
          this.setState({movies: response.data.results})
          this.setState({currentPage: response.data.page})
          this.setState({totalPages: response.data.total_pages})
          // console.log("Image config:")
          // console.log(this.state.imageConfig)
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
    const searchChanged = this.props.search !== prevProps.search;
    // console.log(locationChanged)

    if (locationChanged || searchChanged) {
      this.getMovies();
    }
  }

  render() {
    return (
      <div>
          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />

          <div className="message">{this.state.message}</div>
          
          <ListMovies movies={this.state.movies} imageConfig={this.props.imageConfig} />

          <Pagination currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
      </div>
    );
  }
}

function ListMovies(props) {
  const movies = props.movies;
  const imageConfig = props.imageConfig;
  console.log('imageConfig')
  console.log(imageConfig)
  const listItems = movies.map((movie) =>
    <li key={movie.id}>
      {('base_url' in imageConfig && movie.poster_path) ? (
        <img src={imageConfig.base_url + imageConfig.poster_sizes[0] + movie.poster_path} alt={movie.title} />
      ) : (
        <i className="fas fa-spinner"></i>
      )}
      <br />
      {movie.title}<br />
      Release Date: {movie.release_date}<br />
      Average Vote: {movie.vote_average} / 10<br />
      Popularity: {movie.popularity}<br />
      {movie.overview}<br />
      <Link to={'/movie/' + movie.id}>More Info</Link>
    </li>
  );
  return (
    <ul className="movie-list">{listItems}</ul>
  );
}

function Pagination(props) {
  return (
    <div className="pagination">
      Page
      {props.currentPage > 1 &&
        <i className="fas fa-angle-left"></i>
      }
      {props.currentPage}
      {props.currentPage < props.totalPages &&
        <i className="fas fa-angle-right"></i>
      }
      of {props.totalPages}
    </div>
  );
}

export default MovieList;