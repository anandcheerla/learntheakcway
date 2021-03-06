import React,{useState, useRef, useEffect} from "react";
import axios from "axios";
import ls from "local-storage";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from '@material-ui/core/Button';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import AddIcon from '@material-ui/icons/Add';
import { Route, useHistory, useRouteMatch } from "react-router";
import {connect} from 'react-redux';



//components
import Units from "./Units.js";

//css
import "./Article.css";

import {setMyArticles,setUnits} from '../redux/reducers/app';



function Article(props){

    let user_saved_articles_db = ls.get("savedArticles");
    let user_liked_articles_db = ls.get("likedArticles");

    let history=useHistory();
    let {path,url,isExact} = useRouteMatch();


    const [articleCliked,setArticleClicked] = useState(false);
    const [articleHovered,setArticleHovered] = useState(false);
    const [beforeHoverUrl,setBeforeHoverUrl] = useState("");

    const [unitHeading,setUnitHeading] = useState("");
    const [unitShortDescription,setUnitShortDescription] = useState("");
    const [unitLongDescription,setUnitLongDescription] = useState("");
    const [unitPriority,setUnitPriority] = useState("");
    const [unitComplexity,setUnitComplexity] = useState("");
    
    const [articleUploadedTime,setArticleUploadedTime] = useState("Just now");

    const [likes,setLikes] = useState(props.likes);
    const [articleLiked,setArticleLiked] = useState(0);

    
    let sd = ls.get(`${props.dbId}_sd`);

    const [articleSaved,setArticleSaved] = useState(sd || sd=== null && user_saved_articles_db && user_saved_articles_db[props.dbId]===true || false);
    // const [articleLiked,setArticleLiked] = useState(ls.get(`${props.dbId}_ld`) || user_liked_articles_db && user_liked_articles_db[props.dbId]===true || false);


    const [buttonColor,setButtonColor] = useState("default");
    const [showUnitCreationForm,setShowUnitCreationForm] = useState(false);
    const [moreClicked,setMoreClicked] = useState(false);

    const [filteredUnits,setFilteredUnits] = useState(props.units || []);

    const difficulty_filter = useRef(null);
    const importance_filter = useRef(null);

    


    const unitHeadingInputHandler = (e) => {
      e.preventDefault();
      setUnitHeading(e.target.value);
    };

    const unitShortDescriptionInputHandler = (e) => {
      e.preventDefault();
      setUnitShortDescription(e.target.value);
    };

    const unitLongDescriptionInputHandler = (e) => {
      e.preventDefault();
      setUnitLongDescription(e.target.value);
    };

    const unitPriorityInputHandler = (e) => {
      e.preventDefault();
      setUnitPriority(e.target.value);
    };

    const unitComplexityInputHandler = (e) => {
      e.preventDefault();
      setUnitComplexity(e.target.value);
    };



  //add unit api call to /add-unit route and append the unit to units property of state
  const createUnit = (event) => {
    //to prevent the default behaviour of the event
    event.preventDefault();

    if(unitShortDescription==="" && unitHeading==="" ){
      alert("please fill the mandatory fields");
      return;
    }

    let priority_l = 5;
    let complexity_l = "easy";

    if (unitPriority) {
      priority_l = Number(unitPriority);
    }

    if (unitComplexity) complexity_l = unitComplexity;

    let formData = {
      heading: unitHeading,
      shortDescription: unitShortDescription,
      longDescription: unitLongDescription,
      priority: priority_l,
      complexity: complexity_l
    };

    

    let current_filtered_units = [...filteredUnits];
    let current_article_units = [...props.units];
    let updated_article_units = [...current_article_units, formData];

  
    let complexity = difficulty_filter.current && difficulty_filter.current.value || "all";
    let importance = importance_filter.current && importance_filter.current.value || "all";

    if (
      (complexity === "all" || formData.complexity === complexity) &&
      (importance === "all" || formData.priority === Number(importance))
    ) {
      let updated_filtered_units = [...current_filtered_units,formData];
      setFilteredUnits(updated_filtered_units);

    } 

    //clear the inputs
    setUnitHeading("");
    setUnitShortDescription("");
    setUnitLongDescription("");
    setUnitPriority("");
    setUnitComplexity("");
    
    axios.post(`/user/${props.dbId}/add-unit`, formData).then((res) => {      
      let updated_article_units = [...current_article_units, res.data];
      
      props.setUnits({articleIndex:props.articleIndex,units:updated_article_units});

      if (
        (complexity === "all" || formData.complexity === complexity) &&
        (importance === "all" || formData.priority === Number(importance))
      ) {
        
        let updated_filtered_units = [...current_filtered_units,res.data];
        setFilteredUnits(updated_filtered_units);

      } 
      
    });
  }; //createUnit method end


  const filterByDifficulty = (event) => {
    event.preventDefault();
    let complexity = event.target.value;
    let importance = importance_filter.current.value;

    let units = [...props.units];
    let required_units = [];


    for (let i = 0; i < units.length; i++) {
      if (
        (complexity === "all" || units[i].complexity.toLowerCase() === complexity) &&
        (importance === "all" || units[i].priority === Number(importance))
      ){
    
        required_units.push(units[i]);
      }
    }
    // 
    setFilteredUnits(required_units);
    
  };



  const filterByImportance = (event) => {
    event.preventDefault();
    let importance = event.target.value;

    let complexity = difficulty_filter.current.value;

    let units = [...props.units];
    let required_units = [];

    for (let i = 0; i < units.length; i++) {
      if (
        (importance === "all" || units[i].priority === Number(importance)) &&
        (complexity === "all" || units[i].complexity.toLowerCase() === complexity)
      )
        required_units.push(units[i]);
    }
    // 
    setFilteredUnits(required_units);
  };


  const areYouSureModal = () => {

    return window.confirm("Are you sure, you want to delete the article ?");

  };


  const articleMoreSelectHandler = (event,option) => {
    event.preventDefault();
    event.persist();

    if (option === "delete_article") {
      if(areYouSureModal())
      {
          axios.delete("/user/article-delete/"+props.dbId).then(res=>{});
          let articles_from_context = [...props.articles];
          articles_from_context[props.articleIndex]=null;
          props.setMyArticles(articles_from_context);
          setMoreClicked(false);
      }
    } 
    else if (option === "save_article") {
          saveArticleHandler();
          setMoreClicked(false);
    } 
    else if (option === "remove_article") {
          removeArticleHandler();
          setMoreClicked(false);
    }
    else if (option === "change_visibility") {
      setMoreClicked(false);
      if (props.visibility==="private") {
        axios
          .get(`/user/${props.dbId}/make-article-public`)
          .then((res) => {
            // if (res.data === true)
              // event.target.selectedOptions[0].label = "Make public";
          });
      }
       else {
        axios
          .get(`/user/${props.dbId}/make-article-private`)
          .then((res) => {
            // if (res.data === false)
              // event.target.selectedOptions[0].label = "Make private";
          });
      }
    }
  };



  // //this function will return the form for unit creation
  const unitCreationForm = () => {

    return (
      <div id="Article__unit-creation-form">
        <div className="Article__text-area-input">
          <TextareaAutosize
            className=""
            id=""
            onChange={(e)=>{unitHeadingInputHandler(e)}}
            value={unitHeading}
            name="heading"
            placeholder="Heading"
          />
        </div>
        <div className="Article__text-area-input">
          <TextareaAutosize
            className=""
            id=""
            name="shortDescription"
            rowsMin={3}
            onChange={(e)=>{unitShortDescriptionInputHandler(e)}}
            value={unitShortDescription}
            placeholder="Short description"
          />
        </div>
        <div className="Article__text-area-input">
          <TextareaAutosize
            className=""
            id=""
            name="longDescription"
            rowsMin={3}
            placeholder=""
            onChange={(e)=>{unitLongDescriptionInputHandler(e)}}
            value={unitLongDescription}
            placeholder="Long description"
          />
        </div>
        <div className="Article__buttons-input-outer-div">
          <div>
          <div className="Article__buttons-input">
              <select onChange={(e)=>{unitPriorityInputHandler(e)}}>
                <option>Priority</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
          </div>
          <div className="Article__buttons-input">
            <select onChange={(e)=>{unitComplexityInputHandler(e)}}>
                <option>Complexity</option>
                <option>Basic</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>
          </div>
          </div>
        </div>
        <div className="Article--center-align">
          <Button
                onClick={(e)=>{createUnit(e)}}
                variant="outlined"
                color="primary"
                endIcon={<AddIcon/>}
          >
          Create
          </Button>
        </div>
      </div>
    );
  };

  const more = ()=>{
    
    return (
      <div onClick={(e)=>e.stopPropagation()} id="Article__more_dropdown">
          <div onClick={(e)=>{setMoreClicked(!moreClicked)}}>More</div>
          {
            moreClicked
            &&
            props.type==="myArticle"
            &&
            <div onClick={(e)=>articleMoreSelectHandler(e,"change_visibility")}>Make {props.visibility==="private"?"public":"private"}</div>
          }
          {
            moreClicked
            &&
            props.type==="myArticle"
            &&
            <div onClick={(e)=>articleMoreSelectHandler(e,"delete_article")}>Delete Article</div>
          }
          {
            moreClicked
            &&
            (
            !articleSaved
            ?
            <div onClick={(e)=>articleMoreSelectHandler(e,"save_article")}>Save</div>
            :      
            <div onClick={(e)=>articleMoreSelectHandler(e,"remove_article")}>Remove</div>
            )
          }
      </div>
    );
  }


  const unitComplexityFilter=()=>{
    return (
      <div onClick={(e)=>e.stopPropagation()} id="Article__unit_difficulty_filter">
          <select ref={difficulty_filter} name="complexity" id="Article__unit_difficulty_filter_id" onChange={(e)=>filterByDifficulty(e)}>

            <option value="all">Complexity</option>                  
            <option value="basic">Basic</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
    );
  }
  const unitPriorityFilter=()=>{
    return (
      <div onClick={(e)=>e.stopPropagation()} id="Article__unit_importance_filter">
        <select ref={importance_filter} name="priority" id="Article__unit_importance_filter_id" onChange={(e)=>filterByImportance(e)}>
          <option value="all">Priority</option>                  
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
    </div>
    );
  }
  
    const articleClickHanlder=()=>{
      if(!articleCliked){
        setArticleClicked(true);
        setBeforeHoverUrl(url);
        history.push(`${url}/${props.dbId}`);
      }
      else if(articleCliked){
        setShowUnitCreationForm(false);
        setArticleClicked(false);
        history.push(beforeHoverUrl);
      }
    }

    const articleHoverHandler=()=>{
      if(!articleCliked){
        if(!articleHovered){
          setArticleHovered(true);
          setBeforeHoverUrl(url);
          history.push(`${url}/${props.dbId}`);
        }
        else if(articleHovered){
          setArticleHovered(false);
          history.push(beforeHoverUrl);
        }
      }
    }

    const likeHandler=()=>{
      setArticleLiked(!articleLiked);
      try{
        
        articleLiked && axios.post(`/article/unlike-article/${props.dbId}`).then((res)=>{
          if(res.data===true){    
            console.log("true unliked");
          }
          else if(res.data===false){
            console.log("false");
          }
        });

        articleLiked && axios.post(`/article/like-article/${props.dbId}`).then((res)=>{
          if(res.data===true){    
            console.log("true liked");
          }
          else if(res.data===false){
            console.log("false");
          }
        });
      }
      catch(err){
        console.log(err);
      }
    }

    const saveArticleHandler = ()=>{
      try{
        axios.post(`/user/save-article/${props.dbId}`).then((res)=>{
          if(res.data===true){
            ls.set(`${props.dbId}_sd`,true);
            setArticleSaved(true);
          }
        });
      }
      catch(err){
        console.log(err);
      }

    }

    
    const removeArticleHandler = ()=>{
      try{
        axios.post(`/user/unsave-article/${props.dbId}`).then((res)=>{
          if(res.data===true){
            console.log("removed from saved articles");
            ls.set(`${props.dbId}_sd`,false);
            setArticleSaved(false);
          }
        });
      }
      catch(err){
        console.log(err);
      }

    }



    const calculateTimeForArticle=()=>{
      if(props.lastUpdatedTime===undefined || props.lastUpdatedTime===null)
        return;
      let currentTs=new Date();
      let articleTs=new Date(props.lastUpdatedTime);
      let diff=Math.floor(currentTs-articleTs);
      let minutes=Math.floor(diff/(1000*60));   //1000 is for milli seconds and 60 for seconds


      let articleMonth = articleTs.getMonth();
      let articleDate = articleTs.getDate();

      let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      if(currentTs.getDate()===articleDate && currentTs.getMonth()===articleMonth){
        if(minutes<=0)
          setArticleUploadedTime("Just now");
        else if(minutes<60)
          setArticleUploadedTime(minutes+" min ago");
        else
          setArticleUploadedTime(Math.floor(minutes/60)+" hours ago");
      }
      else{
        setArticleUploadedTime(months[articleMonth]+" "+articleDate);
      }

    }

    useEffect(calculateTimeForArticle,[]);


    return (
      <div id="Article">
        <div onClick={articleClickHanlder} >
          <div>
            <h1 data-test='Article__heading'>{props.heading}</h1>
            <p data-test='Article__description'>{props.description}</p>
          </div>
          <Route exact path={`${path}`}>
            <div>
              {
                props.type!="myArticle"
                &&
                <p data-test='Article__uploader-first-name'>{props.uploaderFirstName}</p>
              }
              <p>{articleUploadedTime}</p>
            </div>
          </Route>
          <div className="Article--right-align" id="Article__more-icon-div">
            {more()}
            {/* <MoreHorizIcon/> */}
          </div>
        </div>
        <Route path={`${path}/${props.dbId}`}>
          {
            props.units 
            &&
            props.units.length>0
            &&
            <div data-test='Article__filters' id="Article__filters">
              {
                unitComplexityFilter()
              }
              {
                unitPriorityFilter()
              }
            </div>
          }
          
          <Units units={filteredUnits}/>

          <div>
            <div className="Article--center-align">
              {
              !showUnitCreationForm
              &&
              props.type==="myArticle"
              &&
              <Button
                onClick={(e)=>{setShowUnitCreationForm(true)}}
                variant="outlined"
                color="primary"
                endIcon={<AddIcon/>}
              >Unit</Button>
              }
            </div>
            {
              showUnitCreationForm
              &&
              unitCreationForm()
            }
          </div>
       </Route>
       <div>
          <div id="Article__likes-div">
            <div>
              <ThumbUpAltOutlinedIcon onClick={likeHandler}/>
            </div>
            <div>
              <label>{likes+articleLiked}</label>
            </div>
          </div>
       </div>
      </div>

    );

} 

function mapStateToProps(state){
  return {
    articles: state.app.articles
  }
}

export default connect(mapStateToProps,{setMyArticles,setUnits})(Article);
