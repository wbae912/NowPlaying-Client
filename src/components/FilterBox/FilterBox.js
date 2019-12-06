//Dependencies
import React, { Component } from 'react';
import UserContext from '../../utils/context'

class FilterBox extends Component {
  static contextType = UserContext;

  constructor(props){
    super(props)
    this.state = {
      minimumYear: '',
      maximumYear: '',
      rating: '',
      familyRating: '',
      error: null,
      originalCategoryItems: []
    }
  }
  
  componentDidMount() {
    this.setState({
      originalCategoryItems: this.context.filteredCategoryItems
    })
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    let currentCategoryItems = this.context.searchedCategoryItems;
    e.preventDefault();

    if(this.state.minimumYear){
      currentCategoryItems = currentCategoryItems.filter(item => Number(this.state.minimumYear) <= Number(item.release_date.slice(0,4)))
    }
    if(this.state.maximumYear){
      currentCategoryItems = currentCategoryItems.filter(item => Number(this.state.maximumYear) >= Number(item.release_date.slice(0,4)))
    }
    if(this.state.rating) {
      currentCategoryItems = currentCategoryItems.filter(item => Number(item.imdb_rating) >= Number(this.state.rating));
    }
    if(this.state.familyRating) {
      currentCategoryItems = currentCategoryItems.filter(item => item.mpaa_rating === this.state.familyRating);
    }
    this.context.setFilteredCategoryItems(currentCategoryItems);
    this.setState({
      minimumYear: '',
      maximumYear: '',
      rating: '',
      familyRating: ''
    })
  }

  handleClear = e => {
    e.preventDefault();
    this.setState({
      minimumYear: '',
      maximumYear: '',
      rating: '',
      familyRating: '',
      originalCategoryItems: this.state.originalCategoryItems
    })
    document.getElementById('searchBar').value='';
    this.context.setFilteredCategoryItems(this.context.categoryItems);
    this.context.setSearchedCategoryItems(this.context.categoryItems);
  }

  render() {
    return (
      <form id="filterForm" name="filterForm" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="minimumYear" id="minimumYearLabel" name="minimumYearLabel">Earliest Year:</label>
        <input 
          type="text" 
          placeholder="1920" 
          id="minimumYear" 
          name="minimumYear" 
          onChange={(e) => this.setState({minimumYear: e.target.value})}
        />
        <label htmlFor="latestYear" id="latestYearLabel" name="latestYearLabel">Latest Year:</label>
        <input 
          type="text" 
          placeholder={new Date().getFullYear()}
          id="latestYear"
          name="maximumYear" 
          onChange={(e) => this.setState({maximumYear: e.target.value})} 
        />
        <label htmlFor="rating" id="ratingLabel" name="ratingLabel">Minimum Rating:</label>
        <select 
          id="rating" 
          name="rating" 
          defaultValue="1"
          onChange={(e) => {this.setState({rating: e.target.rating})}} 
        >
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
          <option value="7">7</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <label htmlFor="rating" id="ratingLabel" name="ratingLabel">Highest Family Rating:</label>
        <select 
          id="familyRating" 
          name="familyRating" 
          defaultValue="R"
          onChange={(e) => this.setState({familyRating: e.target.value})} 
        >
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
        </select>
        <button type="submit">Submit</button>
        <button type="button" onClick={(e) => this.handleClear(e)}>Clear</button>
      </form>
    );
  }
}
export default FilterBox;