import React,{useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
// import { cleanup } from '@testing-library/react';



const News = (props) =>{

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState();
  // document.title = `${capitalize(props.category)} - NewsMonkey`


  const capitalize =(strings)=>{
    return strings[0].toUpperCase() + strings.slice(1)
   }

  const updatePage = async ()=>{
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(40);
    let parseData = await data.json();
    props.setProgress(60);
    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false)
    props.setProgress(100);
    
  }

useEffect( ()=> {
  document.title = `${capitalize(props.category)} - NewsMonkey`
  updatePage()
  // eslint-disable-next-line
} , [] )

  const fetchMoreData = async ()=>{
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    setLoading(true)
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
    setLoading(false)
  }

    return (
      <>
      {/* <div className='container my-3'> */}
      <h2 className='text-center' style={{margin : '80px 0px'}}>News Monkey - Top {capitalize(props.category)} Headlines</h2>
      {/* {this.state.loading && <Spinner/>} */}
      <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={totalResults!==articles.length}
          loader={totalResults!==articles.length?<Spinner/>:''}
        >
        <div className="container">
        <div className="row my-3">
          {articles.map((elements)=>{
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
      </>
    )
   }



News.defaultProps = {
  country : 'in',
  pageSize : 8,
  category : 'general',
}

News.propTypes = {
  country : PropTypes.string,
  pageSize : PropTypes.number,
  category : PropTypes.string,
}

export default News
