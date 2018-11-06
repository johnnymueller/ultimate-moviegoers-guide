import React from "react"
import queryString from 'query-string'

const Pagination = class Pagination extends React.Component {
  goToPage = (whichPage) => {
  	const currentPage = this.props.currentPage
  	let page = null
  	switch (whichPage) {
  		case 'next':
	  		page = currentPage + 1
  			break
  		case 'prev':
	  		page = currentPage - 1
  			break
  		case 'last':
	  		page = this.props.totalPages
  			break
  		default:
  			page = 1
  	}

		let search = queryString.parse(this.props.navigation.location.search)
		search.page = page

		const pathname = this.props.navigation.location.pathname
		const destination = pathname + '?' + queryString.stringify(search)

    const history = this.props.navigation.history
    history.push(destination)
  }

  render() {
  	if (this.props.totalPages < 2)
  		return ''

	  return (
	    <div className="pagination">
	      {this.props.currentPage > 1 &&
	      	<span>
		      	<i onClick={() => this.goToPage('first')} className="fas fa-angle-double-left"></i>
		      	<i onClick={() => this.goToPage('prev')} className="fas fa-angle-left"></i>
					</span>	      	
	      }

	      &nbsp;
	      {this.props.currentPage}
	      &nbsp; of {this.props.totalPages}

	      {this.props.currentPage < this.props.totalPages &&
	      	<span>
		      	<i onClick={() => this.goToPage('next')} className="fas fa-angle-right"></i>
		      	<i onClick={() => this.goToPage('last')} className="fas fa-angle-double-right"></i>
		      </span>
	      }
	    </div>
	  )
	}
}

export default Pagination