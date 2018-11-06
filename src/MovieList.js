import React from "react"
import { Link } from "react-router-dom"
import queryString from 'query-string'
import Api from './Api'
import Pagination from './Pagination'

class MovieList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	loading: false,
      message: 'Welcome to The Ultimate Moviegoers Guide! Use the controls above to discover.',
      currentPage: 0,
      totalPages: 0,
      movies: [],
    }
  }

  componentDidMount() {
    this.getMovies(this.props)
  }

  getMovies(props) {
  	console.log('Getting movies...')
    this.setState({loading: true})
    this.setState({message: ''})

    // popular is default
    let endpoint = 'discover/movie'
    let params = {
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: false,
      include_video: false,
      page: 1,
    }

    // top rated
    if (props.match.params.type === 'top-rated') {
      params.certification_country = 'US'
      params.sort_by = 'vote_average.desc'
    }
    // now playing
    if (props.match.params.type === 'now-playing') {
      endpoint = 'movie/now_playing'
      delete params.sort_by
    }

    // search
    const search = queryString.parse(props.location.search)
    if (props.match.params.type === 'search') {
      endpoint = 'search/movie'
      params.query = search.query
    }
    // pagination
    if (search.page) {
    	params.page = search.page
    }

    Api(endpoint, params)
    .then((response) => {
	    this.setState({movies: response.data.results})
	    this.setState({currentPage: response.data.page})
	    this.setState({totalPages: response.data.total_pages})
	    this.setState({loading: false})
	    if (response.data.total_results === 0) {
	    	this.setState({message: "Sorry, no titles matched your search. Please try another."})
	    }
    })
    .catch(function (error) {
    	this.setState({message: "Sorry, there was an error. Please try something else."})
      console.log(error)
    })
  }

  // componentDidUpdate(prevProps) {
  // 	console.log('componentDidUpdate')
    // const locationChanged = this.props.location !== prevProps.location
    // const searchChanged = this.props.search !== prevProps.search
    // // console.log(locationChanged)

    // if (locationChanged || searchChanged) {
    //   this.getMovies()
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
  		return <div className="loading"><i className="fas fa-spinner fa-spin"></i></div>

    return (
      <div>
          <Pagination navigation={this.props} currentPage={this.state.currentPage} totalPages={this.state.totalPages} />

          {this.state.message &&
          	<div className="message">{this.state.message}</div>
          }
          
          <ListMovies movies={this.state.movies} imageConfig={this.props.imageConfig} />

          <Pagination navigation={this.props} currentPage={this.state.currentPage} totalPages={this.state.totalPages} />
      </div>
    )
  }
}

function ListMovies(props) {
  const movies = props.movies
  const imageConfig = props.imageConfig
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
      <p>{movie.overview}</p>
      <Link className="button" to={'/movie/' + movie.id}>More Info</Link>
    </li>
  )
  return (
    <ul className="movie-list">{listItems}</ul>
  )
}

export default MovieList