import React from "react"
import ApiCall from './ApiCall'

class MovieItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: {},
      dataMap: {
        title: {type: 'string'},
        original_title: {type: 'string'},
        status: {type: 'string'},
        release_date: {type: 'string'},
        tagline: {type: 'string'},
        overview: {type: 'string'},
        budget: {type: 'currency'},
        revenue: {type: 'currency'},
        genres: {type: 'list'},
        homepage: {type: 'website'},
        imdb_id: {type: 'imdb'},
        original_language: {type: 'string'},
        popularity: {type: 'string'},
        production_companies: {type: 'list'},
        production_countries: {type: 'list'},
        runtime: {type: 'time'},
        spoken_languages: {type: 'list'},
        vote_average: {type: 'string'},
        vote_count: {type: 'string'},
      }
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

          <ItemDetails data={this.state.data} dataMap={this.state.dataMap} />
          
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

class ItemDetails extends React.Component {
  prettify(str) {
    return str.replace(/(_|^)([^-]?)/g, function(_, prep, letter) {
      return (prep && ' ') + letter.toUpperCase()
    })
  }

  formatCurrency(amount) {
    if (amount) {
      return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    } else {
      return 'N/A'
    }
  }

  renderArray(array) {
    return (
      <ul>
        {array.map(function(item) {
          return <li key={item.name}>{item.name}</li>
        })}
      </ul>
    )
  }

  render() {
    const data = this.props.data
    const dataMap = this.props.dataMap
    
    const listItems = Object.keys(dataMap).map((key) => {
      let term = this.prettify(key)
      let detail = ''
      switch (dataMap[key].type) {
        case 'string':
          detail = data[key] || 'N/A'
          break
        case 'website':
          detail = (data[key]) ? <a target="_blank"rel="noopener noreferrer" href={data[key]}>{data[key]}</a> : 'N/A'
          break
        case 'imdb':
          detail = (data[key]) ? <a target="_blank"rel="noopener noreferrer" href={"https://www.imdb.com/title/" + data[key]}>{data[key]}</a> : 'N/A'
          break
        case 'currency':
          detail = (data[key]) ? this.formatCurrency(data[key]) : 'N/A'
          break
        case 'list':
          detail = (data[key].length > 0) ? this.renderArray(data[key]) : 'N/A'
          break
        default:
          // handle unknown types
          detail = 'N/A'
      }

      return <li key={term}><strong>{term}</strong>: {detail}</li>
    })

    return (
      <ul>
        {listItems}
      </ul>
    )
  }
}

export default MovieItem