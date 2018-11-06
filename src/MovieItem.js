import React from "react"
import ApiCall from './ApiCall'

class MovieItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: {}
    }
  }

  componentDidMount() {
    this.getMovie()
  }

  getMovie() {
    const endpoint = 'movie/' + this.props.match.params.id
    ApiCall(endpoint)
    .then((response) => {
      this.setState({data: response.data})
      this.setState({loading: false})
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  formatMoney = (amount) => {
    if (amount) {
      return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    } else {
      return 'N/A'
    }
  }

  render() {
    if (this.state.loading)
      return <div className="loading"><i className="fas fa-spinner fa-spin"></i></div>

    const imageConfig = this.props.imageConfig
    const movie = this.state.data

    return (
      <div className="movie-item">
        {('secure_base_url' in imageConfig && movie.backdrop_path) &&
          <img className="backdrop" src={imageConfig.secure_base_url + imageConfig.backdrop_sizes[2] + movie.backdrop_path} alt={movie.title} />
        }
        <div className="content">
          {('secure_base_url' in imageConfig && movie.poster_path) ? (
            <img src={imageConfig.secure_base_url + this.props.imageConfig.poster_sizes[3] + movie.poster_path} alt={movie.title} className="poster" />
          ) : (
            <i className="fas fa-image poster"></i>
          )}
          <ul>
            <li><strong>Title:</strong> {this.state.data.title || 'N/A'}</li>
            <li><strong>Original Title:</strong> {this.state.data.original_title || 'N/A'}</li>
            <li><strong>Status:</strong> {this.state.data.status || 'N/A'}</li>
            <li><strong>Release Date:</strong> {this.state.data.release_date || 'N/A'}</li>
            <li><strong>Tagline:</strong> {this.state.data.tagline || 'N/A'}</li>
            <li><strong>Overview:</strong> {this.state.data.overview || 'N/A'}</li>
            <li><strong>Budget:</strong> {this.formatMoney(this.state.data.budget)}</li>
            <li><strong>Revenue:</strong> {this.formatMoney(this.state.data.revenue)}</li>
            <li>
                <strong>Genres:</strong>
                <ul>
                {this.state.data.genres.map((genre) =>
                  <li key={genre.id}>{genre.name}</li>
                )}
                </ul>
            </li>
            <li><strong>Homepage:</strong> <a target="_blank"rel="noopener noreferrer" href={this.state.data.homepage}>{this.state.data.homepage}</a></li>
            <li><a target="_blank"rel="noopener noreferrer" href={"https://www.imdb.com/title/" + this.state.data.imdb_id}>IMDb Link</a></li>
            <li><strong>Original Language:</strong> {this.state.data.original_language || 'N/A'}</li>
            <li><strong>Popularity:</strong> {this.state.data.popularity || 'N/A'}</li>
            <li>
              <strong>Production Companies:</strong>
              <ul>
                {this.state.data.production_companies.map((company) =>
                  <li key={company.id}>{company.name}</li>
                )}
              </ul>
            </li>
            <li>
              <strong>Production Countries:</strong>
              <ul>
                {this.state.data.production_countries.map((countries) =>
                  <li key={countries.iso_3166_1}>{countries.name}</li>
                )}
              </ul>
            </li>
            <li><strong>Runtime:</strong> {this.state.data.runtime} minutes</li>
            <li>
              <strong>Spoken Languages:</strong>
              <ul>
                {this.state.data.spoken_languages.map((languages) =>
                  <li key={languages.iso_639_1}>{languages.name}</li>
                )}
              </ul>
            </li>
            <li><strong>Vote Average:</strong> {this.state.data.vote_average || 'N/A'}</li>
            <li><strong>Vote Count:</strong> {this.state.data.vote_count || 'N/A'}</li>
          </ul>
          <button
            className="button icon-left"
            onClick={this.goBack}>
              Back
          </button>
        </div>
      </div>
    )
  }
}

// function GenreList(props) {
//   console.log('genres')
//   console.log(props)
//   const genres = props.genres
//   const listItems = genres.map((genre) =>
//     // Correct! Key should be specified inside the array.
//     <li key={genre.id}>{genre.name}</li>
//   )
//   return (
//     <ul>
//       {listItems}
//     </ul>
//   )
// }

export default MovieItem