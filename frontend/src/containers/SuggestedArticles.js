import React,{useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { Route, useHistory, useRouteMatch } from 'react-router';

//components
import Articles from "../components/Articles.js";
import Article from "../components/Article.js";
import Tag from "../components/Tag.js";


//css
import './SuggestedArticles.css';

//context
import {AppContext} from '../AppContext.js';


function SuggestedArticles(props){

    const [suggestedArticles,setSuggestedArticles]=useState([]);
    let {path,url} = useRouteMatch();
    let history = useHistory();
    const appCtx = useContext(AppContext);

    const [tags,setTags] = useState([]);
    const [tagArticles,setTagArticles] = useState([]);

    const [tagFetchMessage,setTagFetchMessage] = useState("");

    //fetch suggested articles
    const fetchSuggestedArticlesFromDb = () => {
        axios.get("/articles/home").then((res) => {
            let articles_temp_var = [...res.data];
            // let fetchArticlesFromDb_temp_var = true;
            // appCtx.articles.set(articles_temp_var);
            setSuggestedArticles(articles_temp_var);
            // setFetchedMyArticlesFromDb(fetchArticlesFromDb_temp_var);
        });
    
    };
    
    const fetchTagsFromDb = () =>{
      axios.get("/topic/get-all-tags").then(res=>{
        const tags = [...res.data];
        setTags(tags);

      }); 

    }

    const fetchArticlesByTag= (event,tagName) =>{
      setTagArticles([]);
      history.push(`${url}/topic/${tagName}`);
      axios.get(`/topic/${tagName}/0/5`).then(res=>{
        if(res.data!=false){
          const articles = [...res.data];
          setTagArticles(articles);
          setTagFetchMessage("");
        }
        else{
          setTagFetchMessage("Sorry, No Articles Found with this Tag!!");
        }
      });
    }

    // useEffect(fetchSuggestedArticlesFromDb,[]);
    useEffect(fetchTagsFromDb,[]);

    return (

        <div id="SuggestedArticles">
          <Route path={`${path}`}>
            <div id="SuggestedArticles__tags">
            {
              tags.map(tag => (
                <div onClick={(e)=>fetchArticlesByTag(e,tag.tagName)}>
                  <Tag tagName={tag.tagName}/>
                </div>
              ))
            }
            </div>
            <Articles type="otherArticle" articles={suggestedArticles}/>
          </Route>

          <Route path={`${path}/topic/:tagName`}>
            <div id="Suggested__articles-container">
              {
                tagArticles.length==0
                ?
                <div className="center-align">
                  <h2>{tagFetchMessage}</h2>
                </div>
                :
                tagArticles.map((element) => (
                  element!=null
                  &&
                  <Article
                    type="otherArticle"
                    key={element._id}
                    dbId={element._id}
                    heading={element.heading}
                    description={element.description}
                    units={element.units}
                    lastUpdatedTime={element.lastUpdatedTime}
                    uploaderFirstName={element.uploaderFirstName}
                    uploaderUserName={element.uploaderUserName || appCtx.username.get}
                    visibility={element.visibility}
                    likes={element.likes}
                  >
                  </Article>)
                )
              }
              </div>
          </Route>
          
        </div>

      );

}

export default SuggestedArticles;