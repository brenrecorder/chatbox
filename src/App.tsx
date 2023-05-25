import logo from './assets/logo.svg';
import styles from './App.module.scss';
import { useEffect,useState, useRef } from 'react';
import React, { Component } from "react";
import ReactDOM from "react-dom";
//import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import {Link } from "react-router-dom";
import $ from 'jquery';
 import axios from "axios";
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import { render } from 'react-dom';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const ROOT_CSS = css({

  scrollbarWidth: 'thin', 
  height: '230px', 
  overflow: 'auto', 
  width: '290px', 
  border:'0px solid black', 
  borderRadius:'3px'
});

const Promise = require("bluebird");
const getJson = require("axios-get-json-response");
const cheerio = require("cheerio");
const server = "http://tbwebspecialist.nl/chatbox/";
function App() {

 var [currUser, setcurrUser] =useState('');
 
 var [currPwd, setcurrpassword] =useState('');
  var [currContact, setCurrContact] =useState('');
  var [loggedin, setLoggedin] = useState(false);
    var [chatactive, setActiveChat] = useState(false);

      var [contacts, setContacts] =useState([]);
      var [currpage, setcurrpage] =useState('login');
      var [chatsb, setChats] = useState([]);
           var [chatmessage, setChatMessage] = useState('');
    var [newUser, setNewuser] = useState([]);
      
    const setPage = (title) => {
        setcurrpage(title)
        
    };

	  const getPage = (event) => {
    event.preventDefault();
    const response = axios.get(server + 'chat.php?action=viewcontacts&username=' + currUser + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
 setContacts(JSON.parse(JSON.stringify(response.data)));
 setcurrpage('contacts');
setCurrContact('')
setLoggedin(true);
//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })

  };


 const updateUsers = (event) => {
    const response = axios.get(server+'chat.php?action=viewcontacts&username=' + currUser  + "&password=" + currPwd)
  .then(function (response) {
    const temp = JSON.parse(JSON.stringify(response.data))
    if (temp.length != contacts.length) {
 setContacts(JSON.parse(JSON.stringify(response.data)));
    } else {
      
    }
  })
  .catch(function (error) {
    console.log(error);
  })
  };
	 const deleteContact = (event) => {
    if (window.confirm('Are you sure you wish to delete this contact?')) {
    const response = axios.get(server+'chat.php?action=deletecontact&username=' + currUser  + "&password=" + currPwd + "&contactdel=" + currContact)
  .then(function (response) {
    updateUsers('');
    setcurrpage('contacts');
  })
  .catch(function (error) {
    console.log(error);
  })
    }
  };

	  const getchatsb = (event) => {
  
    const response = axios.get(server+'chat.php?action=viewmessage&username=' + currUser + '&adrFrom=' + currContact  + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
const temp = JSON.parse(JSON.stringify(response.data))
    if (temp.length != chatsb.length) {
 setChats(JSON.parse(JSON.stringify(response.data)));
    }
//setIsLoggedIn(true) QUYh4SgF

  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })
  getPage('');
  };
  function handleChangeContact(contact) {
setCurrContact(contact)
setcurrpage('chat');
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
  const response = axios.get(server+'chat.php?action=addcontact&username=' + currUser + '&newcontact=' + newUser + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;

//setIsLoggedIn(true) QUYh4SgF
updateUsers('');
  })
  .catch(function (error) {
    // handle error


    console.log(error);
  })
    handleChangeUser('');
  //localhost/chat.php?action=sendmessage&username=test&sendto=test12&message=HOIII
    };

	  const sendChat = (event) => {
    event.preventDefault();
  const response = axios.get(server+'chat.php?action=sendmessage&username=' + currUser + '&sendto=' + currContact + '&message=' + chatmessage + "&password=" + currPwd)
  .then(function (response) {
    // handle success
    console.log(response.data);
//test = response.data;
setChatMessage('');
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


  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const counter = count + 1;
      setCount(counter);
 
      if (contacts.length > 0) { getchatsb(''); getPage(''); updateUsers(''); }
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);



 useEffect(() => {
    // 👇️ scroll to bottom every time messages change
  
  }, [chatsb]);

  
  const [showEmoji, setShowEmoji] = useState(false)

  const addEmoji = emoji => {
    console.log(emoji)
  
    setChatMessage(chatmessage + emoji.native)
    setShowEmoji(false)
  }
  
    return (
        <div className={styles.App}>
		  <header className={styles['App-header']}>
                    
    <h5>Chatbox</h5>
    <p style={{fontSize: '15px'}}>Username: {currUser}</p>
    {currpage == 'login' &&
     <div> 
     <form onSubmit={getPage}>
    <p style={{fontSize: '12px'}}>Please login or register to contact a friend<br />or page admin.</p>
      <label style={{color: 'green', fontSize: '12px', display:'inline-block', width: '70px'}}>Username</label>{`\t`}<input style={{width:'110px'}} onChange={handleChangeUser} type="text"></input><br />
      <label style={{color: 'green', fontSize: '12px', display:'inline-block', width: '70px'}}>Password</label>{`\t`}<input style={{width:'110px'}} onChange={handleChangepassword} type="password"></input><br /><br />
      <input style={{color:'white', backgroundColor: 'black', height: '28px', width: '250px', border: '1px solid orange'}} type="submit" value="Login / Register" /> <br /></form> </div>
      }  
    
    {currpage=='chat' && 
    <div>    
    <label style={{fontSize:'15px'}}>Chat with:</label>&nbsp;
    <a href='#' style={{fontSize:'15px', textDecoration: 'none', color: 'green'}} onClick={getchatsb}>{currContact}</a>  
    </div>}
    {currpage=='chat' && !showEmoji && ( 
    <ScrollToBottom id='chats' className={ROOT_CSS}> <br />
    {chatsb.slice(0, 250).reverse().map((item, index) => (
               <p style={{ height:'auto', width: '205px',fontSize:'12px', wordWrap: 'break-word',display:'block', textAlign:'left', marginLeft: '2px'}}><b>{item.from}</b>:&nbsp;{item.chatmessage}</p>  
       ))}   <br />
         </ScrollToBottom>)}
      
           {currpage=='chat' &&  (<div><form onSubmit={sendChat}><label style={{fontSize:'15px'}}>Chat:</label>&nbsp;
<input type="text"  style={{width:'130px'}} value={chatmessage}  onChange={e => setChatMessage(e.target.value)} />&nbsp;<input style={{color:'white', backgroundColor: 'black', height: '25px', width: '70px', border: '1px solid green'}} type="submit" value="Send" /><br /> 
        </form>
        {!showEmoji && ( <a style={{color:'lightblue', fontSize:'15px'}} onClick={() => setShowEmoji(!showEmoji)}>Emoticon</a> )}
        {showEmoji && ( <a style={{color:'lightblue', fontSize:'15px'}} onClick={() => setShowEmoji(!showEmoji)}>Close emoticons</a> )}
      {showEmoji && (  <Picker maxFrequentRows='2' theme='dark' searchPosition='none' navPosition='none' previewPosition='none' onEmojiSelect={addEmoji} emojiButtonSize='24' emojiSize='24'/>)}
      <br />
      <a style={{color:'lightblue', fontSize:'15px'}} onClick={() => { updateUsers(''); setCurrContact(''); setcurrpage('contacts'); }}>Exit chat</a><br />
        {currUser=='admin' && <a style={{color:'lightblue', fontSize:'15px'}} onClick={deleteContact}>Delete contact</a> }
          </div>)}
     {currpage == 'contacts' &&     
 
     <div><label style={{fontSize:'15px'}}>
   
     <b>Contacts</b></label> 
    <div ref={div} id='chats' style={{ height: 'auto', width: '290px', border:'0px solid black', borderRadius:'3px' }} >
          {contacts.map((item, index) => (
              <div onClick={() => { setcurrpage('chat'); setCurrContact(item.user); getchatsb('');  }} style={{fontSize:'11px', lineHeight:'25px', border: '1px solid black', height:'25px', width: '290px', display: 'block', backgroundColor: 'orange', color: 'black', textDecoration: 'bold', marginTop:'3px'}}>{item.user}&nbsp; ({item.messages})</div>
            
       ))}
       </div>
       </div>}
    
      {currpage == 'contacts' && 
       <div>
     <form onSubmit={addUser}>
        <br /><label style={{fontSize:'15px'}}>Add user:</label>&nbsp;
          <input type="text" style={{width:'70px'}} onChange={handleChangeNewuser} />&nbsp;
          <input style={{color:'white', backgroundColor: 'black', height: '25px', width: '70px', border: '1px solid blue'}} type="submit" value="Add" /> <br /> 
        </form><br />
        <a style={{color:'lightblue', fontSize:'15px'}}onClick={() => { setCurrContact(''); setcurrpage('login'); }}>Logout</a>

       </div> }
                      
             
  
                      
            </header>
        </div>
    );
}

export default App;