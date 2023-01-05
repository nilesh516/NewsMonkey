import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {

  static defaultProps = {
    country : 'in',
    pageSize : 8,
    category : 'general',
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,
  }
   capitalize(strings){
    return strings[0].toUpperCase() + strings.slice(1)
   }

  constructor(props){
    super(props);
    this.state = {
      articles : [],
      loading : false,
      page : 1,

    }
    document.title = `${this.capitalize(this.props.category)} - NewsMonkey`
  }

  async updatePage(){
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    this.props.setProgress(40);
    let parseData = await data.json();
    this.props.setProgress(60);
    this.setState({articles : parseData.articles, 
      totalResults : parseData.totalResults,
      loading:false,
    })
    this.props.setProgress(100);

  }

 async componentDidMount(){
  this.updatePage();

  }

  handlePrevClick =async ()=>{
    this.setState({page : this.state.page - 1,},()=>{this.updatePage()});

  }
  handleNextClick =async ()=>{
    this.setState({page : this.state.page + 1},()=>{this.updatePage()});

  }
  fetchMoreData = async ()=>{
    this.setState({page : this.state.page + 1})
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({articles :this.state.articles.concat(parseData.articles), 
      totalResults : parseData.totalResults,
    })

  }

  render() {
    return (
      <>
      {/* <div className='container my-3'> */}
      <h2 className='text-center' style={{margin : '30px 0px'}}>News Monkey - Top {this.capitalize(this.props.category)} Headlines</h2>
      {/* {this.state.loading && <Spinner/>} */}
      <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.totalResults!==this.state.articles.length}
          loader={this.state.totalResults!==this.state.articles.length?<Spinner/>:''}
        >
        <div className="container">
        <div className="row my-3">
          {/*!this.state.loading && */this.state.articles.map((elements)=>{
            return(
            <div className="col-md-4" key={elements.url}>
                <NewsItem title={elements.title?elements.title.slice(0,20):""} 
                         description={elements.description?elements.description.slice(0,80):""} 
                         imageUrl={elements.urlToImage} 
                         newsUrl={elements.url}
                         author={elements.author} 
                         date={elements.publishedAt} 
                         source={elements.source.name} />
            </div>)
          })}
            
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
            <button disabled={this.state.page<=1} type="button" className="btn btn-outline-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
            <button disabled={this.state.page>=Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-outline-dark" onClick={this.handleNextClick}>Next &rarr;</button>
          </div>  */}
      {/* </div> */}
      </>
    )
  }
}

export default News
