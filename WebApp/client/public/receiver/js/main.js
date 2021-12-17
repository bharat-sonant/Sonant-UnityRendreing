import { Receiver } from "./receiver.js";
import { getServerConfig } from "../../js/config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
  import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';



setup();

let playButton;
let receiver;
let useWebSocket;
let submitButton;


window.document.oncontextmenu = function () {
  return false;     // cancel default menu
};

//  window.addEventListener('resize', function () {
//    receiver.resizeVideo();
//  }, true);

window.addEventListener('beforeunload', async () => {
  await receiver.stop();
}, true);


  const firebaseConfig = {
    apiKey: "AIzaSyCSHWNuatWyVVa7RnpHWdDkDHHgo9WAvoc",
    authDomain: "webapp-6b214.firebaseapp.com",
    databaseURL: "https://webapp-6b214-default-rtdb.firebaseio.com",
    projectId: "webapp-6b214",
    storageBucket: "webapp-6b214.appspot.com",
    messagingSenderId: "1040941419260",
    appId: "1:1040941419260:web:e85a21a3346c028ed76579"
  };

  const app = initializeApp(firebaseConfig);


function writeUserData(userId) {
  const db = getDatabase();
  set(ref(db), {
    framedata: document.getElementById("txtScentance").value

      });
}
  



async function setup() {
  const res = await getServerConfig();
  useWebSocket = res.useWebSocket;
  showWarningIfNeeded(res.startupMode);
  showPlayButton();
  showsubmitButton();
  showSaveButton();
}

function showSaveButton(){
  
    let element=document.getElementById('btnSave');
    element.addEventListener('click', saveData);

}

function saveData(){
  let element=document.getElementById('txtScentance');
  writeUserData("PJ");
}

function showWarningIfNeeded(startupMode) {
  const warningDiv = document.getElementById("warning");
  if (startupMode == "private") {
    warningDiv.innerHTML = "<h4>Warning</h4> This sample is not working on Private Mode.";
    warningDiv.hidden = false;
  }
}

function showPlayButton() {
  if (!document.getElementById('playButton')) {
    let elementPlayButton = document.createElement('img');
    elementPlayButton.id = 'playButton';
    elementPlayButton.src = 'images/Play.png';
    elementPlayButton.alt = 'Start Streaming';
    playButton = document.getElementById('player').appendChild(elementPlayButton);
    playButton.addEventListener('click', onClickPlayButton);
  }
}

function onClickPlayButton() {

  playButton.style.display = 'none';

  const playerDiv = document.getElementById('player');

  // add video player
  const elementVideo = document.createElement('video');
  elementVideo.id = 'Video';
  elementVideo.style.touchAction = 'none';
  playerDiv.appendChild(elementVideo);

  setupVideoPlayer(elementVideo).then(value => receiver = value);

  // add fullscreen button
  const elementFullscreenButton = document.createElement('img');
  elementFullscreenButton.id = 'fullscreenButton';
  elementFullscreenButton.src = 'images/FullScreen.png';
  playerDiv.appendChild(elementFullscreenButton);
  elementFullscreenButton.addEventListener("click", function () {
    if (!document.fullscreenElement || !document.webkitFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        if (playerDiv.style.position == "absolute") {
          playerDiv.style.position = "relative";
        } else {
          playerDiv.style.position = "absolute";
        }
      }
    }
  });
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('fullscreenchange', onFullscreenChange);

  function onFullscreenChange() {
    if (document.webkitFullscreenElement || document.fullscreenElement) {
      playerDiv.style.position = "absolute";
      elementFullscreenButton.style.display = 'none';
    }
    else {
      playerDiv.style.position = "relative";
      elementFullscreenButton.style.display = 'block';
    }
  }
}
function showsubmitButton() {
  if (!document.getElementById('submitButton')) {
    let elementPlayButton = document.createElement('img');
    elementPlayButton.id = 'submitButton';
    elementPlayButton.src = 'images/submit.png';
    elementPlayButton.alt = 'Start Streaming';
    playButton = document.getElementById('player').appendChild(elementPlayButton);
    playButton.addEventListener('click', onClicksubmitButton);
  }
}

function onClicksubmitButton() {

  
    const db = getDatabase();
    set(ref(db, 'users/' + "1"), {
      username: "Abhinav"
    });
    
}
async function setupVideoPlayer(elements) {
  const videoPlayer = new Receiver(elements);
  await videoPlayer.setupConnection(useWebSocket);

  videoPlayer.ondisconnect = onDisconnect;

  return videoPlayer;
}

function onDisconnect() {
  const playerDiv = document.getElementById('player');
  clearChildren(playerDiv);
  receiver.stop();
  receiver = null;
  showPlayButton();
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

