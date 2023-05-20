import logo from './assets/logo.svg';
import styles from './App.module.scss';
import { useEffect,useState, useRef } from 'react';
import React, { Component } from "react";
import ReactDOM from "react-dom";
//import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import {Link } from "react-router-dom";
import $ from 'jquery';
 import axios from "axios";

const Promise = require("bluebird");
const getJson = require("axios-get-json-response");
const cheerio = require("cheerio");

function App() {



 var [currUser, setcurrUser] =useState('');
 
 var [currPwd, setcurrpassword] =useState('');
  var [currContact, setCurrContact] =useState('admin');
  var [loggedin, setLoggedin] = useState(false);
      var [contacts, setContacts] =useState([]);
      var [currpage, setcurrpage] =useState('');
      var [chatsb, setChats] = useState([]);
           var [chatmessage, setChatMessage] = useState([]);
    var [newUser, setNewuser] = useState([]);
      
    const setPage = (title) => {
        setcurrpage(title)
        
    };

	  const getPage = (event) => {
    event.preventDefault();
    const response = axios.get('chat.php?action=viewcontacts&username=' + currUser + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
 setContacts(JSON.parse(JSON.stringify(response.data)));

//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })

  };
	  function updateUsers() {
  
    const response = axios.get('chat.php?action=viewcontacts&username=' + currUser  + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
 setContacts(JSON.parse(JSON.stringify(response.data)));
if (contacts.length >0) {
setLoggedin(true)
} else {
setLoggedin(false)

}
//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })

  };

	  const getchatsb = (event) => {
  
    const response = axios.get('chat.php?action=viewmessage&username=' + currUser + '&adrFrom=' + currContact  + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
 setChats(JSON.parse(JSON.stringify(response.data)));

//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })

  };
  function handleChangeContact(contact) {
setCurrContact(contact)

};
  function handleChangeUser(evt) {
setcurrUser(evt.target.value)

};
  function handleChangepassword(evt) {
setcurrpassword(evt.target.value)

};
  function handleChangeChat(evt) {

setChatMessage(evt.target.value)
};
  function handleChangeNewuser(evt) {

setNewuser(evt.target.value)
};

	  const addUser = (event) => {
    event.preventDefault();
  const response = axios.get('chat.php?action=addcontact&username=' + currUser + '&newcontact=' + newUser + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
updateUsers();
//setIsLoggedIn(true) QUYh4SgF
getPage('');
  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })

  getPage('');
    handleChangeUser('');
  //localhost/chat.php?action=sendmessage&username=test&sendto=test12&message=HOIII
    };

	  const sendChat = (event) => {
    event.preventDefault();
  const response = axios.get('chat.php?action=sendmessage&username=' + currUser + '&sendto=' + currContact + '&message=' + chatmessage + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
setChatMessage([]);
getchatsb('');
getPage('');
//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })
  //localhost/chat.php?action=sendmessage&username=test&sendto=test12&message=HOIII
    };

   const div = useRef(null);
const bottomRef = useRef(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const counter = count + 1;
      setCount(counter);
      if (contacts.length > 0) { getchatsb(''); getPage(''); }

	
   
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);



    return (
        <div className={styles.App}>
		  <header className={styles['App-header']}>
                    <form onSubmit={getPage}>
    <h5>SpecCMS Chatbox</h5>
    {contacts.length < 1 &&  
    <p style={{fontSize: '12px'}}>Please login or register to contact a friend<br />or page admin.</p>
    }
					  <br />
                 {contacts.length < 1 &&  
                 <div> 
                <label style={{color: 'green', fontSize: '12px', display:'inline-block', width: '70px'}}>Username</label>{`\t`}<input style={{width:'110px'}} onChange={handleChangeUser} type="text"></input><br />
                <label style={{color: 'green', fontSize: '12px', display:'inline-block', width: '70px'}}>Password</label>{`\t`}<input style={{width:'110px'}} onChange={handleChangepassword} type="password"></input><br />
                <br /> <input style={{color:'white', backgroundColor: 'black', height: '28px', width: '250px', border: '1px solid orange'}} type="submit" value="Login / Register" /> <br /> </div>
                 }  
                      {contacts.length > 0 && 
                      <div>
                     
                    <label style={{fontSize:'15px'}}>Chat with:</label>&nbsp;
                    <a href='#' style={{fontSize:'15px', textDecoration: 'none', color: 'green'}} onClick={getchatsb}>{currContact}</a>  
                      </div>}
                </form> 
                {contacts.length > 0 && 
                     <div ref={div} id='chats' style={{ height: '230px', overflow: 'auto', width: '290px', border:'1px solid black', borderRadius:'3px' }} >     <br />
                             {chatsb.slice(0, 250).reverse().map((item, index) => (
               <p style={{ height:'auto', width: '205px',fontSize:'12px', wordWrap: 'break-word',display:'block', textAlign:'left'}}><b>{item.from}</b>:&nbsp;{item.chatmessage}</p>
                 
       ))}   <br />
         </div>}<div>
       
          {contacts.length > 0 &&  
          <div>  
        <form onSubmit={sendChat}>
        <label style={{fontSize:'15px'}}>Chat:</label>&nbsp;
          <input type="text"  style={{width:'90px'}} value={chatmessage} onChange={handleChangeChat} />&nbsp;
          <input style={{color:'white', backgroundColor: 'black', height: '25px', width: '70px', border: '1px solid green'}} type="submit" value="Send" /> <br /> 
        </form>
          <br /></div> }
     </div>
    {contacts.length > 0 &&   <label style={{fontSize:'15px'}}><b>Contacts</b></label> }
          {contacts.map((item, index) => (

              <div onClick={() => { setCurrContact(item.user); getchatsb(''); }} style={{fontSize:'10px', lineHeight:'25px', border: '1px solid black', height:'25px', width: '205px', display: 'block', backgroundColor: 'gray', color: 'white'}}>{item.user}&nbsp; ({item.messages})</div>
              
              
        
       ))}
       {contacts.length > 0 &&  
       <div>
     <form onSubmit={addUser}>
        <label style={{fontSize:'15px'}}>Add user:</label>&nbsp;
          <input type="text" style={{width:'70px'}} onChange={handleChangeNewuser} />&nbsp;
          <input style={{color:'white', backgroundColor: 'black', height: '25px', width: '70px', border: '1px solid blue'}} type="submit" value="Add" /> <br /> 
        </form>
       </div> }
                      
             
  
                      
            </header>
        </div>
    );
}

export default App;