import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {

  constructor(){
    super();
    this.state = {
      articles : [],
      loading : false

    }
  }

 async componentDidMount(){
    let url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=12485d459295459f82a4ce9e683c712f";
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({articles : parseData.articles})
    console.log(parseData)

  }

  render() {
    return (
      <div className='container my-3'>
      <h2>News Monkey - Top Headlines</h2>
        <div className="row my-3">
          {this.state.articles.map((elements)=>{
            return(
            <div className="col-md-4" key={elements.url}>
                <NewsItem title={elements.title?elements.title.slice(0,20):""} description={elements.description?elements.description.slice(0,80):""} imageUrl={elements.urlToImage} newsUrl={elements.url} />
            </div>)


          })}
            
        </div>
      </div>
    )
  }
}

export default News
