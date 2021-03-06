import React,{useState,useRef} from 'react';
import axios from "axios";
import ls from "local-storage";
import {useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';

//
import {setLogin,setUserName,setUserDetails} from '../redux/reducers/app';

//css
import './Login.css'; 


function Login(props){
   
  //login api call to /login route with username and password
  // const [username,setUsername] = useState("akc");
  // const [password,setPassword] = useState("anandcheerla");
  
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const [usernameMessage,setUsernameMessage] = useState("");
  const [passwordMessage,setPasswordMessage] = useState("");
  const [formMessage,setFormMessage] = useState("");

  const loginButton_Ref = useRef(null);

  let history=useHistory();

  const userLogin = () => {
    // event.preventDefault();

    if(!inputValidation())
        return;

    let formData = {
      username: username,
      password: password
    };

    loginButton_Ref.current.innerHTML = "Logging In";
    loginButton_Ref.current.style.opacity = 0.7;
    // console.log(props);

    axios.post("/user/login", formData).then((res) => {
      if (res.data !== false) {
        props.setLogin(true);
        ls.set("authSession",true);
        props.setUserName(formData.username);
        props.setUserDetails(res.data);
        ls.set("savedArticles",res.data.savedArticles);
        history.push('/home');
        
      } else {
        setFormMessage("Incorrect Credentials");
        loginButton_Ref.current.innerHTML = "Login";
        loginButton_Ref.current.style.opacity = 1;
      }
    });
  }; //userLogin function end

  const inputValidation = ()=>{
    let flag=true;
    if(username===''){
      setUsernameMessage("Please Fill in this field");
      flag=false;
    }
    else{      
      setUsernameMessage("");
    }
    
    if(password===''){
      setPasswordMessage("Please Fill in this field");
      flag=false;
    }
    else{
      setPasswordMessage("");
    }

    return flag;
  }


  return (
      <div id="Login">
        <div className="Login__input-div">
          {/* <label htmlFor="username">Username</label> */}
          <input
            data-test="Login__username-input"
            type="text"
            className="Login__input-field"
            id="Login__username"
            name="username"
            placeholder="username"
            onChange={(e)=>{setUsername(e.target.value)}}
            value = {username}
            required
          />
          <label data-test="Login__username-warning-label" className="Login__input-validation-message">{usernameMessage}</label>
        </div>
        <div className="Login__input-div">
          {/* <label htmlFor="password">Password</label> */}
          <input
            data-test="Login__password-input"
            type="password"
            className="Login__input-field"
            id="Login__password"
            name="password"
            placeholder="password"
            onChange={(e)=>{setPassword(e.target.value);}}
            onKeyDown={(e)=>{
              if(e.which===13)
                userLogin();
            }}
            value = {password}
            required
          />
          <label data-test="Login__password-warning-label" className="Login__input-validation-message">{passwordMessage}</label>
        </div>
        <div className="Login__message">
          <label data-test="Login__form-warning-label" id="Login__login-err-msg" className="Login__input-validation-message">{formMessage}</label>
        </div>
        
        <div className="Login__button">
          <Button data-test="Login__login-button" type="submit" onClick={userLogin} ref={loginButton_Ref} variant="outlined" color="primary">
            Log In
          </Button>
        </div>
      </div>
    );


}

function mapStateToProps(state){
  return {
    
  }
}

export default connect(mapStateToProps,{setLogin,setUserName,setUserDetails})(Login);