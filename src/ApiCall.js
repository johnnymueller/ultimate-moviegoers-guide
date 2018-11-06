
const axios = require('axios')

const ApiCall = (endpoint, params={}) => {
	return new Promise((resolve, reject) => {
		if (!endpoint)
			reject('You must provide and API endpoint.')

		const destination = 'https://api.themoviedb.org/3/' + endpoint
		params.api_key = '4268bd97bf4cfe10c3797b864eef07b8'
		axios.get(destination, {params})
	  .then((response) => {
	    if (response.status === 200) {
	      resolve(response)
	    } else {
	      reject(response)
	    }
	  })
	  .catch(function (error) {
	    reject(error)
	  })
	})
}

export default ApiCall