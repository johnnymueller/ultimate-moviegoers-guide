import React from "react";
const axios = require('axios');

class MovieItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <div>
          {this.state.data.title}
          <ul>
            <li>Title: {this.state.data.title}</li>
            <li>Tagline: {this.state.data.tagline}</li>
            <li>Overview: {this.state.data.overview}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
            <li>Title: {this.state.data.title}</li>
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

export default MovieItem;