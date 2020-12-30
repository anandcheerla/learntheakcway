import React,{useContext, useState, useRef} from "react";
import axios from "axios";
import ls from "local-storage";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from '@material-ui/core/Button';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Route, useHistory, useRouteMatch } from "react-router";



//components
import Unit from "./Unit.js";

//css
import "./Article.css";

//context
import {AppContext} from '../AppContext.js';




function Article(props){

    let appCtx = useContext(AppContext);
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

    const [buttonColor,setButtonColor] = useState("default");
    const [showUnitCreationForm,setShowUnitCreationForm] = useState(false);

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
      setUnitPriority(e.target.innerText);
    };

    const unitComplexityInputHandler = (e) => {
      e.preventDefault();
      setUnitComplexity(e.target.innerText);
    };


    // this.state = {
    //   dbId: this.props.dbId,
    //   heading:
    //     (ls.get(this.props.dbId) && ls.get(this.props.dbId).heading) ||
    //     this.props.heading,
    //   description:
    //     (ls.get(this.props.dbId) && ls.get(this.props.dbId).description) ||
    //     this.props.description,
    //   units:
    //     (ls.get(this.props.dbId) && ls.get(this.props.dbId).units) ||
    //     this.props.units,
    //   filteredUnits:
    //     (ls.get(this.props.dbId) && ls.get(this.props.dbId).filteredUnits) ||
    //     this.props.units,
    //   showArticleCreationForm: false,
    //   showUnitCreationForm: false,
    //   articleClicked: false,
    //   articleDeleted:
    //     (ls.get(this.props.dbId) && ls.get(this.props.dbId).articleDeleted) ||
    //     false,
    //   articleDeleteButtonClicked: true,



  

  //add unit api call to /add-unit route and append the unit to units property of state
  const createUnit = (event) => {
    //to prevent the default behaviour of the event
    event.preventDefault();

    // let acub = document.getElementById("article-create-unit-button");
    // acub.style.opacity = 0.7;

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

    
    // debugger;
    let current_filtered_units = [...filteredUnits];
    let current_article_units = [...props.units];
    let updated_article_units = [...current_article_units, formData];

    let articles_from_context = [...appCtx.articles.get];
    articles_from_context[props.articleIndex].units=updated_article_units;

    //updated context
    appCtx.articles.set(articles_from_context);


    let complexity = difficulty_filter.current.value;
    let importance = importance_filter.current.value;

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

      
      let articles_from_context = [...appCtx.articles.get];
      articles_from_context[props.articleIndex].units=updated_article_units;

      //updated context
      appCtx.articles.set(articles_from_context);

      if (
        (complexity == "all" || formData.complexity == complexity) &&
        (importance == "all" || formData.priority == Number(importance))
      ) {

        let updated_filtered_units = [...current_filtered_units,res.data];
        setFilteredUnits(updated_filtered_units);

      } 

      // }
      // acub.style.opacity = 1;
    });
  }; //createUnit method end


  const filterByDifficulty = (event) => {
    event.preventDefault();
    let complexity = event.target.value;
    let importance = importance_filter.current.value;

    console.log(props.units);
    let units = [...props.units];
    let required_units = [];


    for (let i = 0; i < units.length; i++) {
      if (
        (complexity == "all" || units[i].complexity == complexity) &&
        (importance == "all" || units[i].priority == Number(importance))
      ){
        // console.log(complexity);
        // console.log(units[i].complexity);
        required_units.push(units[i]);
      }
    }
    // debugger;
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
        (importance == "all" || units[i].priority == Number(importance)) &&
        (complexity == "all" || units[i].complexity == complexity)
      )
        required_units.push(units[i]);
    }
    // debugger;
    setFilteredUnits(required_units);
  };


  const areYouSureModal = () => {

    return window.confirm("Are you sure, you want to delete the article ?");

  };


  const articleMoreSelectHandler = (event) => {
    event.preventDefault();
    event.persist();

    let option = event.target.value;
    // debugger;
    if (option === "delete_article") {
      if(areYouSureModal())
      {
          axios.delete("/user/article-delete/"+props.dbId).then(res=>{});
          let articles_from_context = [...appCtx.articles.get];
          articles_from_context[props.articleIndex]=null;
          appCtx.articles.set(articles_from_context);
      }
    } 
    else if (option === "save_article") {
          // axios.delete("/user/article-delete/"+props.dbId).then(res=>{});
          // let articles_from_context = [...appCtx.articles.get];
          // articles_from_context[props.articleIndex]=null;
          // appCtx.articles.set(articles_from_context);
    } 
    else if (option === "change_visibility") {
      if (event.target.selectedOptions[0].label === "Make private") {
        axios
          .post("/settings/article-visibility/" + props.dbId, {
            visibility: "private",
          })
          .then((res) => {
            if (res.data === "success")
              event.target.selectedOptions[0].label = "Make public";
          });
      }
       else {
        axios
          .post("/settings/article-visibility/" + props.dbId, {
            visibility: "public",
          })
          .then((res) => {
            if (res.data === "success")
              event.target.selectedOptions[0].label = "Make private";
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
        <div className="Article__buttons-input">
            <Button variant="outlined" onClick={(e)=>{unitPriorityInputHandler(e)}} size="small"  color="default" className="">
              1
            </Button>
            <Button variant="outlined" onClick={(e)=>{unitPriorityInputHandler(e)}} size="small"  color="default" className="">
              2
            </Button>
            <Button variant="outlined" onClick={(e)=>{unitPriorityInputHandler(e)}} size="small"  color="default" className="">
              3
            </Button>
            <Button variant="outlined" onClick={(e)=>{unitPriorityInputHandler(e)}} size="small"  color="default" className="">
              4
            </Button>
            <Button variant="outlined" onClick={(e)=>{unitPriorityInputHandler(e)}} size="small"  color="default" className="">
              5
            </Button>
        </div>
        <div className="Article__buttons-input">
          <Button variant="outlined" onClick={(e)=>{unitComplexityInputHandler(e)}} size="small" color="default" className="">
            Basic
          </Button>
          <Button variant="outlined" onClick={(e)=>{unitComplexityInputHandler(e)}} size="small" color="default" className="">
            Easy
          </Button>
          <Button variant="outlined" onClick={(e)=>{unitComplexityInputHandler(e)}} size="small" color="default" className="">
            Medium
          </Button>
          <Button variant="outlined" onClick={(e)=>{unitComplexityInputHandler(e)}} size="small" color="default" className="">
            Hard
          </Button>
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
      <div onClick={(e)=>e.stopPropagation()} className="Article__more_dropdown">
        <select name="more" id="Article__more_dropdown_id" onChange={(e)=>articleMoreSelectHandler(e)}>
          <option value="more">More</option>
          <option value="change_visibility">Make {props.visibility==="private"?"public":"private"}</option>
          <option value="delete_article">Delete Article</option>
          <option value="save_article">Save</option>
        </select>
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
      console.log(history.location.pathname);
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

    const calculateTimeForArticle=()=>{
      let currentTs=new Date();
      let articleTs=new Date(props.lastUpdatedTime);
      let diff=currentTs-articleTs;
      let minutes=diff/(1000*60);   //1000 is for milli seconds and 60 for seconds

      let uploadedTime;
      if(Math.floor(minutes/60)>0){
        if(Math.floor(minutes/(60*24))>0){
          uploadedTime=Math.floor(minutes/(60*24));
          if(uploadedTime===1)
            uploadedTime+=" day ago";
          else
            uploadedTime+=" days ago";
        }
        else{
          uploadedTime=Math.floor(minutes/60);
          if(uploadedTime===1)
            uploadedTime+=" hour ago";
          else
            uploadedTime+=" hours ago";
        }
      }
      else{
          uploadedTime=Math.floor(minutes); 
          if(uploadedTime>=0 && uploadedTime<3)
            uploadedTime="Just now";
          else
            uploadedTime+=" minutes ago";    
      }


      let uploader_info_style={
        "border": "1px solid grey",
        "borderRadius": "10px",
        "padding": "5px",
        "backgroundColor": "#aab3ad",
        "float": "right"
      }

      return uploadedTime;
    }

    let uploadedTime = calculateTimeForArticle();
    console.log(props.uploaderFirstName);

    return (
      <div id="Article">
        <div onClick={articleClickHanlder} >
          <div>
            <h1>{props.heading}</h1>
            <p>{props.description}</p>
          </div>
          <Route exact path={`${path}`}>
            <div>
              {
                props.type!="myArticle"
                &&
                <p>{props.uploaderFirstName}</p>
              }
              <p>{uploadedTime}</p>
            </div>
          </Route>
          <div className="Article--right-align" id="Article__more-icon-div">
            {more()}
            {/* <MoreHorizIcon/> */}
          </div>
        </div>
        <Route path={`${path}/${props.dbId}`}>
          <div id="Article__filters">
            {
              unitComplexityFilter()
            }
            {
              unitPriorityFilter()
            }
          </div>
          
          {
          filteredUnits
          &&
          filteredUnits.map((unit)=>(
            ls.get(unit._id)==null
            &&
            <Unit 
            heading={unit.heading} 
            shortDescription={unit.shortDescription} 
            longDescription={unit.longDescription}
            priority={unit.priority}
            complexity={unit.complexity}
            unitId={unit._id}
            articleId={props.dbId}
            uploaderUserName={props.uploaderUserName}
            articleIndex={props.articleIndex}
            unitIndex={unit.unitIndex}
            />
          ))
          }
          <div>
            <div className="Article--center-align">
              {
              !showUnitCreationForm
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
          <ThumbUpAltOutlinedIcon/>
          <ThumbDownAltOutlinedIcon/>
       </div>
      </div>

    );

} 

export default Article;