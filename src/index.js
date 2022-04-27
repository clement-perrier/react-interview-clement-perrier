import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FilteredMultiSelect from 'react-filtered-multiselect'
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';

const movies = [
  {
    id: '1',
    title: 'Oceans 8',
    category: 'Comedy',
    likes: 4,
    dislikes: 1
  }, {
    id: '2',
    title: 'Midnight Sun',
    category: 'Comedy',
    likes: 2,
    dislikes: 0
  }, {
    id: '3',
    title: 'Les indestructibles 2',
    category: 'Animation',
    likes: 3,
    dislikes: 1
  }, {
    id: '4',
    title: 'Sans un bruit',
    category: 'Thriller',
    likes: 6,
    dislikes: 6
  }, {
    id: '5',
    title: 'Creed II',
    category: 'Drame',
    likes: 16,
    dislikes: 2
  }, {
    id: '6',
    title: 'Pulp Fiction',
    category: 'Thriller',
    likes: 11,
    dislikes: 3
  }, {
    id: '7',
    title: 'Pulp Fiction',
    category: 'Thriller',
    likes: 12333,
    dislikes: 32
  }, {
    id: '8',
    title: 'Seven',
    category: 'Thriller',
    likes: 2,
    dislikes: 1
  }, {
    id: '9',
    title: 'Inception',
    category: 'Thriller',
    likes: 2,
    dislikes: 1
  }, {
    id: '10',
    title: 'Gone Girl',
    category: 'Thriller',
    likes: 22,
    dislikes: 12
  },
]

export const movies$ = new Promise((resolve, reject) => setTimeout(resolve, 100, movies))

const multiSelectBootstrapClasses = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary',
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: null,
    };
  }

  render() {
    return (
      <div className='card' style={{"display": (this.props.filtered ? 'flex' : 'none')}}>
        <strong>{this.props.movie.title}</strong>
        <span>{this.props.movie.category}</span>
        <div className='evaluation'>
          <div className={'thumb ' + (this.props.isLiked ? 'thumb-up-selected' : 'thumb-up')}
               onClick={() => this.props.onThumbUpClick(this.props.isLiked)}>
          </div>
          {this.props.movie.likes}
          <div className={'thumb ' + (this.props.isLiked === null ? 'thumb-down' : this.props.isLiked ? 'thumb-down' : 'thumb-down-selected')}
               onClick={() => this.props.onThumbDownClick(this.props.isLiked)}>
          </div>
          {this.props.movie.dislikes}
        </div>
        {/* <div className='delete' onClick={this.props.onDeleteClick}></div> */}
        <div className='remove-button-container'>
          <button className="remove-button btn btn-danger btn-sm rounded-10" type="button" onClick={this.props.onDeleteClick}>Remove</button>
        </div>
      </div>
    );
  }
}

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      categoryOptions: null,
      selectedCategories: [],
      filteredMovies: null,
      perPage: 12,
      offset: 0,
      isLikedMap: null,
      currentPage: 0
    };
  }

  filterMovies(selectedCategories, movieArray) {
    const filteredMovieArray = new Array();
      for(let i = 0; i < movieArray.length; i++){
        for(let j = 0; j < selectedCategories.length; j++){
          if (movieArray[i].category === selectedCategories[j].text) {
              filteredMovieArray.push(movieArray[i])
          }
        }
      }

    this.setState({
      filteredMovies: filteredMovieArray,
      pageCount: Math.ceil(filteredMovieArray.length / this.state.perPage)
    })

    let currentOffset = this.state.offset
    let previousOffset = currentOffset - this.state.perPage
    let currentPage = this.state.currentPage
    while (currentOffset > 0) {
      if (filteredMovieArray.slice(currentOffset, currentOffset + this.state.perPage).length === 0 && filteredMovieArray.slice(previousOffset, currentOffset).length !== 0) {
        currentPage--
        this.setState({
          offset: previousOffset,
          currentPage: currentPage
        })
        return
      } else {
        currentOffset = previousOffset
        previousOffset = previousOffset - this.state.perPage
        currentPage--
      }
      
    }
  }

  updatedCategoryState(movieArray) {
    const tempArray = new Array()
    const objectArray = new Array()
    for(let i = 0; i < movieArray.length; i++) {
      if(!tempArray.includes(movieArray[i].category)){
        tempArray.push(movieArray[i].category)
        objectArray.push({'value': i, 'text': movieArray[i].category})
      }
    }
    return objectArray
  }

  componentDidMount() {
    
    movies$.then((movieArray) => {
      const categoryOptions = this.updatedCategoryState(movieArray)

      const isLikedMap = new Map()
      movieArray.map(movie => isLikedMap.set(movie.id, null));

      this.setState({
        data: movieArray,
        categoryOptions: this.updatedCategoryState(movieArray),
        selectedCategories: this.updatedCategoryState(movieArray),
        isLikedMap
      })
    
      this.filterMovies(categoryOptions, movieArray)
    });
  }

  handleDeleteClick(movieId) {

    const movieArray = this.state.data.slice();
    for (let i = 0; i < movieArray.length; i++){
      if(movieArray[i].id === movieId) {
        movieArray.splice(i, 1);
        this.setState({ data: movieArray, filteredMovies: movieArray});
      }
    }

    const categoryArray = new Array()
    
    for(let i = 0; i < movieArray.length; i++) {
      categoryArray.push(movieArray[i].category)
    }

    const selectedCategories = this.state.selectedCategories.slice()
    for(let i = 0; i < this.state.selectedCategories.length; i++) {
      if(!categoryArray.includes(this.state.selectedCategories[i].text)) {
        selectedCategories.splice(i, 1)
      }
    }
    
    const categoryOptions = this.state.categoryOptions.slice()
    for(let i = 0; i < this.state.categoryOptions.length; i++) {
      if(!categoryArray.includes(this.state.categoryOptions[i].text)) {
        categoryOptions.splice(i, 1)
      }
    }

    this.setState({
      categoryOptions: categoryOptions,
      selectedCategories: selectedCategories,
      pageCount: Math.ceil(movieArray.length / this.state.perPage),
    })

    if (movieArray.slice(this.state.offset, this.state.offset + this.state.perPage).length === 0) {
      this.setState({
        currentPage: --this.state.currentPage,
        offset: this.state.offset - this.state.perPage
      })
    }

  }

  handleThumbUpClick(movieId) {
    const movieArray = this.state.data.slice();
    const newIsLikedMap = new Map(this.state.isLikedMap)
    const isLiked = this.state.isLikedMap.get(movieId)
    for (let i = 0; i < movieArray.length; i++){
      if(movieArray[i].id === movieId) {
        if(isLiked) {
          movieArray[i].likes--;
          newIsLikedMap.set(movieId, null)
          this.setState({isLikedMap: newIsLikedMap})
        } else if(isLiked === null) {
          movieArray[i].likes++
          newIsLikedMap.set(movieId, true)
          this.setState({isLikedMap: newIsLikedMap})
        } else {
          movieArray[i].likes++;
          newIsLikedMap.set(movieId, true)
          this.setState({isLikedMap: newIsLikedMap})
          movieArray[i].dislikes--;
        }
        this.setState({ data: movieArray });
        return;
      }
    }

  }

  handleThumbDownClick(movieId) {
    const movieArray = this.state.data.slice();
    const newIsLikedMap = new Map(this.state.isLikedMap)
    const isLiked = this.state.isLikedMap.get(movieId)
    for (let i = 0; i <= movieArray.length; i++){
      if(movieArray[i].id === movieId) {
        if(isLiked) {
          movieArray[i].dislikes++
          newIsLikedMap.set(movieId, false)
          this.setState({isLikedMap: newIsLikedMap})
          movieArray[i].likes--;
        }
        else if(isLiked === null) {
          movieArray[i].dislikes++
          newIsLikedMap.set(movieId, false)
          this.setState({isLikedMap: newIsLikedMap})
        } else {
          movieArray[i].dislikes--;
          newIsLikedMap.set(movieId, null)
          this.setState({isLikedMap: newIsLikedMap})
        }
        this.setState({ data: movieArray });
        return;
      }
    }

  }

  renderCard(movie) {
    const filtered = this.state.filteredMovies.includes(movie)
    return (<Card key={movie.id} 
                  movie={movie}
                  onDeleteClick={() => this.handleDeleteClick(movie.id)}
                  onThumbUpClick={() => this.handleThumbUpClick(movie.id)}
                  onThumbDownClick={() => this.handleThumbDownClick(movie.id)}
                  filtered={filtered}
                  isLiked={this.state.isLikedMap.get(movie.id)}/>)
  }

  handleDeselect(index) {
    var selectedCategories = this.state.selectedCategories.slice()
    selectedCategories.splice(index, 1)
    this.setState({selectedCategories})
    this.filterMovies(selectedCategories, this.state.data);
  }

  handleSelectionChange = (selectedCategories) => {
    this.setState({selectedCategories})
    this.filterMovies(selectedCategories, this.state.data);
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({
      offset: offset,
      currentPage: e.selected,
      pageCount: Math.ceil(this.state.filteredMovies.length / this.state.perPage)
    })
  }

  handleSelectChange = (e) => {
    
    this.setState({
      perPage: parseInt(e.target.value),
      pageCount: Math.ceil(this.state.filteredMovies.length / parseInt(e.target.value)),
      currentPage: 0,
      offset: 0
    });
  }

  render() {
    if(this.state.filteredMovies) {
      const slicedData = this.state.filteredMovies.slice(this.state.offset, this.state.offset + this.state.perPage)
      return (
        <div className='main-container'>
          <div className='card-pagination-container'>
            <div className='card-list'>
              {slicedData.map((movie) => (
                this.renderCard(movie)
              ))}
            </div>
            <div className='pagination-container'>
              <ReactPaginate
                  nextLabel="next >"
                  onPageChange={this.handlePageClick}
                  pageRangeDisplayed={null}
                  marginPagesDisplayed={2}
                  pageCount={this.state.pageCount}
                  previousLabel="< previous"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                  forcePage={this.state.currentPage}
                />
                <select className="form-select pagination-select" value={this.state.perPage} onChange={this.handleSelectChange}>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                </select>
            </div>
          </div>
          <div className="filter-container">
          <FilteredMultiSelect
            showFilter={false}
            onChange={this.handleSelectionChange} 
            options={this.state.categoryOptions}
            selectedOptions={this.state.selectedCategories}
            textProp='text'
            valueProp='value'
            classNames={multiSelectBootstrapClasses}
            />
            {this.state.selectedCategories.length === 0 && <p>(nothing selected yet)</p>}
            {this.state.selectedCategories.length > 0 && <div className='filter-list'>
              {this.state.selectedCategories.map((category, i) => 
              <div className="selected-filter" key={category.value}>
              <button className="remove-filter-button btn btn-danger btn-sm rounded-10" type="button" onClick={() => this.handleDeselect(i)}>&times;</button>
              {category.text}
              </div>)}
            </div>}
          </div>
        </div>
      )
    }
    return <div>Chargement des données ...</div>;
    
  }

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CardList />)
