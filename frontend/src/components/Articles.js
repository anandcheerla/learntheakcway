import React,{useContext,useState} from "react";
import axios from "axios";
import ls from "local-storage";


//components
import Article from "./Article.js";

//css
import "./Articles.css";

//context
import {AppContext} from '../AppContext.js';


function Articles(props){

    const appCtx = useContext(AppContext);

      // articles: [...this.props.articles],

    //inline properties or variables
    // let reverseDirectionForArticlesArray = {
    //   display: "flex",
    //   flexDirection: "column-reverse",
    // };

    // let newArticleButtonStyle = {
    //   position: "fixed",
    //   top: "30",
    //   right: "0",
    // };

    // debugger;

    return (
      <div id="Articles">
        <div>
            <div id="Articles__articles-container">
            {
              props.articles.map((element,ele_ind) => (
              element!=null
              &&
              <Article
                key={element._id}
                dbId={element._id}
                heading={element.heading}
                description={element.description}
                units={element.units}
                lastUpdatedTime={element.lastUpdatedTime}
                uploaderFirstName={element.uploaderFirstName}
                uploaderUserName={element.uploaderUserName || appCtx.username.get}
                visibility={element.visibility}
                articleIndex={ele_ind}
              >
              </Article>))
            }
            </div>
        </div>
      </div>   
    );

}
export default Articles;
