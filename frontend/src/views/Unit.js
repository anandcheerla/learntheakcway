import React from 'react';
import axios from 'axios';

//user defined packages or files
import '.././App.css';
import ls from 'local-storage';


class Unit extends React.Component{
  constructor(props){

      super(props);

      this.state={
          modalDisplay: false,
          heading: (ls.get(this.props.unitId) && ls.get(this.props.unitId).heading) || this.props.heading,
          shortDescription: (ls.get(this.props.unitId) && ls.get(this.props.unitId).shortDescription) || this.props.shortDescription,
          longDescription: (ls.get(this.props.unitId) && ls.get(this.props.unitId).longDescription) || this.props.longDescription,
          priority: (ls.get(this.props.unitId) && ls.get(this.props.unitId).priority) || this.props.priority,
          complexity: (ls.get(this.props.unitId) && ls.get(this.props.unitId).complexity) || this.props.complexity,
          unitDeleted: (ls.get(this.props.unitId) && ls.get(this.props.unitId).unitDeleted) || false,
          editUnitMode: false,
          headingInput: "",
          shortDescriptionInput: "",
          longDescriptionInput: "",
          priorityInput: "",
          complexityInput: ""
      }
  }//constructor end


  onClickHandler=(event)=>{
    
      this.setState({
        modalDisplay: !this.state.modalDisplay
      });
    
  }//onClickHandler method end


  closeButtonHandler=()=>{  
    
    this.setState({
          modalDisplay: !this.state.modalDisplay
    });
  }//closeButtonHandler method end

  deleteUnitButtonHandler=()=>{

    axios.delete("/unit-delete/"+this.props.articleId+"/"+this.props.unitId).then(res=>{
      // console.log(res);
      ls.set(this.props.unitId,{unitDeleted:true});
      this.setState({modalDisplay: "none",unitDeleted: true});

    });
  }



  updateUnit = (event)=>{

    event.preventDefault();

    let cub = document.getElementById("Create-unit-button");
    cub.style.opacity = 0.7;

    

    let formData={
      heading: this.state.headingInput || this.state.heading,
      shortDescription: this.state.shortDescriptionInput || this.state.shortDescription,
      longDescription: this.state.longDescriptionInput || this.state.longDescription,
      priority: this.state.priorityInput || this.state.priority,
      complexity: this.state.complexityInput || this.state.complexity
    }
    
    axios.put("/unit-update/"+this.props.articleId+"/"+this.props.unitId,formData).then(res=>{

      ls.set(this.props.unitId,{heading: formData.heading,shortDescription: formData.shortDescription, longDescription: formData.longDescription, priority: formData.priority, complexity: formData.complexity });
      this.setState({
        editUnitMode:false,
        heading: formData.heading,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        priority: formData.priority,
        complexity: formData.complexity
      });
    });

  }

  handleHeadingInput=(e)=>{
    e.preventDefault();
    this.setState({headingInput: e.target.value});
  }
  handleShortDescriptionInput=(e)=>{
    e.preventDefault();
    this.setState({shortDescriptionInput: e.target.value});
  }
  handleLongDescriptionInput=(e)=>{
    e.preventDefault();
    this.setState({longDescriptionInput: e.target.value});
  }
  handlePriorityInput=(e)=>{
    e.preventDefault();
    this.setState({priorityInput: e.target.value});
  }
  handleComplexityInput=(e)=>{
    e.preventDefault();
    this.setState({complexityInput: e.target.value});
  }



  unitCreationForm=()=>{
    let align={
        "textAlign":"center"
    }

      // console.log(typeof this.state.heading);
    return (
      <form name="createUnit" onSubmit={(e)=>{this.updateUnit(e)}} >
        <div className="form-group">
          <label htmlFor="heading"></label>
          <input type="text" className="form-control" id="heading" name="heading" onChange={(e)=>{this.handleHeadingInput(e)}} value={this.state.headingInput||this.state.heading}/>
        </div>
        <div className="form-group">
          <label htmlFor="shortDescription"></label>
          <textarea type="text" className="form-control" id="shortDescription" name="shortDescription" onChange={(e)=>{this.handleShortDescriptionInput(e)}} value={this.state.shortDescriptionInput||this.state.shortDescription}/>
        </div>
        <div className="form-group">
          <label htmlFor="longDescription"></label>
          <textarea type="text" className="form-control" id="longDescription" name="longDescription" onChange={(e)=>{this.handleLongDescriptionInput(e)}} value={this.state.longDescriptionInput||this.state.longDescription}/>
        </div>
        <div className="form-group">
          <label htmlFor="priority"></label>
          <select className="form-control" id="priority" onChange={(e)=>{this.handlePriorityInput(e)}} value={this.state.priorityInput||this.state.priority}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="complexity"></label>
          <select className="form-control" id="complexity" onChange={(e)=>{this.handleComplexityInput(e)}} value={this.state.complexityInput||this.state.complexity}>
            <option value="basic">Basic</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div style={align}>
          <button type="submit" className="btn btn-outline-primary" id="Create-unit-button">Create</button>
          <button onClick={()=>{this.setState({editUnitMode: false})}} className="btn btn-outline-primary" id="Create-unit-button">Cancel</button>

        </div>
      </form>
    );

  }//unitCreationForm method end


  render(){

    let unitBorderColor={
      "basic":"#cfc10a",
      "easy":"#7dd943",
      "medium":"#f07f1d",
      "hard":"#f50525"
    }


    let border_color = {
      "border": "1.1px solid "+unitBorderColor[this.state.complexity]
    }
    

    return (
      
      <div>
        {
          !this.state.unitDeleted
          &&
          (
           <div> 
            <div id="unit-unit" style={border_color} onClick={this.onClickHandler}>
              <div id="unit-unit-heading">
                <h4>{this.state.heading}</h4>
              </div>
              <div id="unit-unit-short-desc">
                <p>{this.state.shortDescription}</p>
              </div>
            </div>
      

            {
              this.state.modalDisplay
              &&
              <div id="unit-unit-modal-container-1">
                <div id="unit-unit-modal-container-2">
                    {  
                      !this.state.editUnitMode
                      && 
                      <div id="unit-unit-modal">
                        <div id="unit-unit-modal-left">
                          <div id="unit-unit-modal-heading">
                            <h3>{this.state.heading}</h3>
                          </div>
                          <div id="unit-unit-modal-short-desc">
                            <h4>Short Description</h4>
                            <div class="unit-unit-modal-desc-value">
                              <p>{this.state.shortDescription}</p>
                            </div>
                          </div>
                          <div id="unit-unit-modal-long-desc">
                            <h4>Long Description</h4>
                            <div class="unit-unit-modal-desc-value">
                              <p>{this.state.longDescription}</p>
                            </div>  
                          </div>
                        </div>
                        <div id="unit-unit-modal-right">
                          <div id="unit-unit-modal-close-button">
                            <button onClick={this.closeButtonHandler} type="button" class="close" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          {this.props.sectionName==="myArticles" &&
                          <div id="unit-unit-modal-settings-tab">
                                <div><h6 id="unitEditButton" onClick={()=>{this.setState({editUnitMode: true})}}>Edit</h6></div>
                                <div><h6 id="unitDeleteButton" onClick={()=>this.deleteUnitButtonHandler()}>Delete</h6></div>
                          </div>
                          }
                          <div id="unit-unit-modal-unit-info">
                            <div id="unit-unit-modal-unit-priority">
                              {this.state.priority}
                            </div>
                            <div id="unit-unit-modal-unit-complexity">
                              {this.state.complexity}
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {
                      this.state.editUnitMode
                      &&
                      <div id="editUnitMode"> 
                        {this.unitCreationForm()}
                      </div>
                    }
                </div> 
              </div>
            }
          </div>
        
          )

        }

      </div>
    );
  }//render method end
}//class Unit end


export default Unit;