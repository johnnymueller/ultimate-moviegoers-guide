import React from "react";
const axios = require('axios');

class MovieItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {}
    };
  }

  componentDidMount() {
    this.getMovie();
  }

  getMovie() {
    console.log('getting movie')
    console.log('this.props')
    console.log(this.props)

    let destination = 'movie/' + this.props.match.params.id;
    let params = {
      api_key: '4268bd97bf4cfe10c3797b864eef07b8',
      // language: 'en-US',
      // sort_by: 'popularity.desc', // popular
      // include_adult: false,
      // include_video: false,
      // // with_genres: 878,
      // page: 1,
      // // ID: 12345
    }

    axios.get('https://api.themoviedb.org/3/' + destination, {params})
      .then((response) => {
        console.log('movies: ');
        console.log(response.data);
        if (response.status === 200) {
          console.log(response)
          this.setState({data: response.data})
          this.setState({loading: false})
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
  //   const locationChanged = this.props.location !== prevProps.location;
  //   const searchChanged = this.props.search !== prevProps.search;
  //   // console.log(locationChanged)

  //   if (locationChanged || searchChanged) {
  //     this.getMovie();
  //   }
  // }

  goBack = () => {
    this.props.history.goBack()
  }

  formatMoney = (amount) => {
    if (amount) {
      return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    } else {
      return 'N/A';
    }
  }

  render() {
    if (this.state.loading)
      return <div>Loading...</div>

    const imageConfig = this.props.imageConfig;
    const movie = this.state.data;

    return (
      <div>
          {('secure_base_url' in imageConfig && movie.backdrop_path) ? (
            <img src={imageConfig.secure_base_url + imageConfig.backdrop_sizes[1] + movie.backdrop_path} alt={movie.title} />
          ) : (
            <i className="fas fa-spinner"></i>
          )}
          {('secure_base_url' in imageConfig && movie.poster_path) ? (
            <img src={imageConfig.secure_base_url + this.props.imageConfig.poster_sizes[1] + movie.poster_path} alt={movie.title} />
          ) : (
            <i className="fas fa-spinner"></i>
          )}
          <ul>
            <li>Title: {this.state.data.title}</li>
            <li>Tagline: {this.state.data.tagline}</li>
            <li>Overview: {this.state.data.overview}</li>
            <li>Budget: {this.formatMoney(this.state.data.budget)}</li>
            <li>
                {/*<GenreList genres={this.state.response.genres} />*/}
                {/*<li>Genres: {this.state.data.genres[0].name}</li>*/}
                {/*this.state.data.genres.map((genre) =>
                  <li key={genre.id}>{genre.name}</li>
                )*/}
            </li>
            <li>Homepage: <a target="_blank" href={this.state.data.homepage}>{this.state.data.homepage}</a></li>
            <li><a target="_blank" href={"https://www.imdb.com/title/" + this.state.data.imdb_id}>IMDb Link</a></li>
            <li>Original Language: {this.state.data.original_language}</li>
            <li>Original Title: {this.state.data.original_title}</li>
            <li>Popularity: {this.state.data.popularity}</li>
            <li>
              <ul>
                {/*<li>Production Companies: {this.state.data.production_companies[0].name}</li>*/}
              </ul>
            </li>
            <li>
              <ul>
                {/*<li>Production Countries: {this.state.data.production_countries[0].name}</li>*/}
              </ul>
            </li>
            <li>Release Date: {this.state.data.release_date}</li>
            <li>Revenue: {this.formatMoney(this.state.data.revenue)}</li>
            <li>Runtime: {this.state.data.runtime} minutes</li>
            <li>
              <ul>
                {/*<li>Spoken Languages: {this.state.data.spoken_languages[0].name}</li>*/}
              </ul>
            </li>
            <li>Status: {this.state.data.status}</li>
            <li>Vote Average: {this.state.data.vote_average}</li>
            <li>Vote Count: {this.state.data.vote_count}</li>
          </ul>
          <button
            className="button icon-left"
            onClick={this.goBack}>
          Back
      </button>
      </div>
    );
  }
}

function GenreList(props) {
  console.log('genres')
  console.log(props)
  const genres = props.genres;
  const listItems = genres.map((genre) =>
    // Correct! Key should be specified inside the array.
    <li key={genre.id}>{genre.name}</li>
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

export default MovieItem;