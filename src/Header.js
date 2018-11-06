import React from "react"
import queryString from 'query-string'
import { NavLink } from "react-router-dom"

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localSearch: '',
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.search) {
      const search = queryString.parse(props.location.search)
      if ('query' in search) {
        this.setState({localSearch: search.query})
      }
    } else {
      this.setState({localSearch: ''})
    }
  }

  handleKey = (event) => {
    if (event.which === 13) {
      this.doSearch()
    }
  }

  handleInputChange = (event) => {
    this.setState({localSearch: event.target.value})
  }

  doSearch = () => {
    if (this.state.localSearch) {
      const history = this.props.history
      history.push('/search?query=' + this.state.localSearch)
    }
  }

  render() {
    return (
      <header>
        <h1>The Ultimate Moviegoers Guide!</h1>

        <input
          placeholder="Search by Title"
          name="search"
          type="text"
          value={this.state.localSearch || ''}
          onChange={this.handleInputChange}
          onKeyUp={this.handleKey}
        />
        <i className="fas fa-search search-button" onClick={() => this.doSearch()}></i>
        <br />

        <NavLink className="button" activeClassName="selected" to="/" exact>Popular</NavLink>
        <NavLink className="button" activeClassName="selected" to="/now-playing">Now Playing</NavLink>
        <NavLink className="button" activeClassName="selected" to="/top-rated">Top Rated</NavLink>

      </header>
    )
  }
}

export default Header