/**
* 
* Created by Idam Obiahu on 9/12/15.
* Copyright (c) 2015 idamo.github.io All rights reserved.
* 
* This extension allows Twitter users to tweet texts, images, links and/or pages
* with a simple (right-)click of the mouse
* 
* This program works with "selection", "link", "image" and "page" (plus others)
* which comes with Chrome Dev Kit.
* 
* Selection: This is when the user right-clicks a text on the screen
* Link: This is when the user right-clicks a link
* Image: This is when a user right-clicks an image
* Page: This is when a user right-clicks on anywhere on the page
**/

/*Declare variables*/
var contextsList=["selection", "link", "image", "page"]; //array containing type of selection
var w = 650; //width of window that opens for tweet
var h = 250; //height of window that opens for tweet
var midWidth = (screen.width/2)-(w/2); //midpoint of the screen (width)
var midHeight = (screen.height/2)-(h/2);//midpoint of the screen (height)
var statusCount = 0;

/*This section is the default for creating a new tweet*/    
var titleMessage = "Compose new tweet"; //refer to line 30

chrome.contextMenus.create({
  title: titleMessage, //shows what the user sees when he/she right-clicks
  contexts: contextsList, //this indicates that it should run for all types listed in the contextsList array above
  onclick: newTweet,//calls the function "newTweet" defined below
});

function newTweet(selected){
  chrome.windows.create({url: "https://twitter.com/intent/tweet?text=", //this loads a window with the URL for creating tweets
  type: "panel", 'width': w, 'height': h, 'left': midWidth, 'top': midHeight}); //specifies how the window is displayed
  //NOTE: type: "panel" creates a simplified window
}


/*This section is the more specific case, where a particular type of tweet is to be sent*/
for(var i = 0; i<contextsList.length; i++){
var context = contextsList[i]; //variable to hold the type of selection

if(context == 'selection')
  titleMessage = "Tweet this text";  //customized message if it is a text
else if(context == 'image')
  titleMessage = "Share the link to this "+ context+" on Twitter"; //because Twitter embeds images
else                            //else, customize message to fit context
  titleMessage = "Share this "+ context+" on Twitter";

chrome.contextMenus.create({
  title: titleMessage, //shows what the user sees when he/she right-clicks
  contexts:[context], //this indicates that it should run for the current context
  onclick: shareHandler, //calls the function "shareHandler" defined below
  id: context //sets id to the current context
});
}

function shareHandler(selected, tab) {
  switch (selected.menuItemId){
    /*If it is a selected text*/
    case 'selection':
      chrome.windows.create({url: "https://twitter.com/intent/tweet?text="
        +encodeURIComponent(selected.selectionText), type: "panel", 
        'width': w, 'height': h, 'left': midWidth, 'top': midHeight});
      break;
      /*If it is a link*/
    case 'link':
      chrome.windows.create({url: "https://twitter.com/intent/tweet?url="
      +encodeURIComponent(selected.linkUrl), type: "panel",
      'width': w, 'height': h, 'left': midWidth, 'top': midHeight});
      break;
      /*If it is an image*/
    case 'image':
      chrome.windows.create({url: "https://twitter.com/intent/tweet?url="
      +encodeURIComponent(selected.srcUrl), type: "panel",
      'width': w, 'height': h, 'left': midWidth, 'top': midHeight});
      break;
      /*If it is a random part of the page*/
    case 'page':
      chrome.windows.create({url: "https://twitter.com/intent/tweet?text="
      +encodeURIComponent(tab.title)+ "&url=" + (selected.pageUrl), type: "panel",
      'width': w, 'height': h, 'left': midWidth, 'top': midHeight});
      break;
  }
}
