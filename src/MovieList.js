import React from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string'
const axios = require('axios');

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	loading: true,
      message: '',
      currentPage: 0,
      totalPages: 0,
      movies: [],
    };
  }

  componentDidMount() {
  	console.log('componentDidMount')
    this.getMovies(this.props);
  }

  getMovies(props) {
    console.log('getting movies')
    // console.log(this.props)

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
    if (props.match.params.type === 'top-rated') {
      params.certification_country = 'US';
      params.sort_by = 'vote_average.desc';
    }
    // in theater: primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    if (props.match.params.type === 'now-playing') {
      destination = 'movie/now_playing'
      delete params.sort_by
      // params.primary_release_date = {
      //   gte: '',
      //   lte: '',
      // };
    }
    const search = queryString.parse(props.location.search);
    if (props.match.params.type === 'search') {
      destination = 'search/movie'
      console.log('search:')
      // console.log(search)
      params.query = search.query
    // } else {
    //   this.props.setSearch('')
    }
    if (search.page) {
    	params.page = search.page
    }

    axios.get('https://api.themoviedb.org/3/' + destination, {params})
      .then((response) => {
        console.log('movies: ');
        // console.log(response.data.results);
        if (response.status === 200) {
          this.setState({movies: response.data.results})
          this.setState({currentPage: response.data.page})
          this.setState({totalPages: response.data.total_pages})
          this.setState({loading: false})
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

  // componentDidUpdate(prevProps) {
  // 	console.log('componentDidUpdate')
    // const locationChanged = this.props.location !== prevProps.location;
    // const searchChanged = this.props.search !== prevProps.search;
    // // console.log(locationChanged)

    // if (locationChanged || searchChanged) {
    //   this.getMovies();
    // }
  // }

  componentWillReceiveProps(props) {
  	console.log('componentWillReceiveProps')
  	// console.log(props)
  	// don't double fire with initial load
  	if (!this.state.loading) {
	  	this.getMovies(props)
	  }
  }

  render() {
  	if (this.state.loading)
  		return <div>Loading...</div>

    return (
      <div>
          <Pagination navigation={this.props} currentPage={this.state.currentPage} totalPages={this.state.totalPages} />

          <div className="message">{this.state.message}</div>
          
          <ListMovies movies={this.state.movies} imageConfig={this.props.imageConfig} />

          <Pagination navigation={this.props} currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
      </div>
    );
  }
}

function ListMovies(props) {
  const movies = props.movies;
  const imageConfig = props.imageConfig;
  const listItems = movies.map((movie) =>
    <li key={movie.id}>
      {('secure_base_url' in imageConfig && movie.poster_path) ? (
        <img className="poster" src={imageConfig.secure_base_url + imageConfig.poster_sizes[1] + movie.poster_path} alt={movie.title} />
      ) : (
        <i className="fas fa-image poster"></i>
      )}
      <h3>{movie.title}</h3>
      <strong>Release Date:</strong> {movie.release_date}<br />
      <strong>Average Vote:</strong> {movie.vote_average} / 10<br />
      <strong>Popularity:</strong> {movie.popularity}<br />
      <p>{movie.overview}</p>
      <Link className="button" to={'/movie/' + movie.id}>More Info</Link>
    </li>
  );
  return (
    <ul className="movie-list">{listItems}</ul>
  );
}

// function Pagination(props) {
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    // 	loading: true,
    //   message: '',
    //   currentPage: 0,
    //   totalPages: 0,
    //   movies: [],
    // };
  }

  goToPage = (page) => {
  	let currentPage = this.props.currentPage
  	if (page === 'next') {
  		page = currentPage + 1
  	} else {
  		page = currentPage - 1
  	}

		let search = queryString.parse(this.props.navigation.location.search)
		search.page = page

		let path = this.props.navigation.location.pathname
		path = path + '?' + queryString.stringify(search)

    const history = this.props.navigation.history
    history.push(path);
  }

  render() {
	  return (
	    <div className="pagination">
	      {this.props.currentPage > 1 &&
	      	<div onClick={() => this.goToPage('prev')}><i className="fas fa-angle-left"></i> Previous</div>
	      }
	      &nbsp;
	      {this.props.currentPage}
	      {this.props.currentPage < this.props.totalPages &&
	      	<div onClick={() => this.goToPage('next')}><i className="fas fa-angle-right"></i> Next</div>
	      }&nbsp;of {this.props.totalPages}
	    </div>
	  );
	}
}

export default MovieList;