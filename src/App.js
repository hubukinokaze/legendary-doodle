import logo from './logo.svg';
import './App.scss';
import * as Pusher from "pusher-js"
import { useState } from "react";
import UserComponent from './components/UserComponent/UserComponent';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = false;
var pusher = new Pusher(
  '154a62cc2ce29c96ffbc', 
  {
    authEndpoint: '/pusher/auth',
    cluster     : 'us3',
    forceTLS    : true,
    auth        : {
      params: {
        id: Math.random(),
        playerId: Math.random(),
        username: Math.random()
      }
    }
  }
);

function App() {
  var bankChannel = pusher.subscribe('carp-channel');
  // var pickChannel = pusher.subscribe('pick-channel');

  var [isHost, setHost] = useState(false);
  var [numPlayers, setNumPlayers] = useState(0);
  var [selectedEvenWord, setEvenWord] = useState('');
  var [selectedOddWord, setOddWord] = useState('');
  var [isReady, setReady] = useState(false);
  var [isGameStarted, setGameStarted] = useState(false);
  var [wordBank, setWordBank] = useState([]);
  var [formState, setFormState] = useState({value: ''});
  var [allWords, setAllWords] = useState('');
  
  var bigData = {
    'numPlayers': numPlayers,
    'selectedEvenWord': selectedEvenWord,
    'selectedOddWord': selectedOddWord,
    'wordBank': wordBank
  }

  bankChannel.bind('client-bank-event', function(data) {
    console.log(123, data);

    // pusher.unsubscribe('client-event');
    bigData.wordBank = data.words;
    setWordBank(bigData.wordBank);
    const bankLen = Object.keys(bigData.wordBank).length;
    // console.log(Math.floor(Math.random() * bankLen));
    bigData.selectedEvenWord = bigData.wordBank[0];
    setEvenWord(bigData.wordBank[0]);

    bigData.selectedOddWord = bigData.wordBank[1];
    setOddWord(bigData.wordBank[1]);

    if (isReady && !isGameStarted) {
      setGameStarted(true);
    }
  });

  function setReadyStatus() {
    setReady(!isReady);

    bigData.numPlayers = ++bigData.numPlayers;
    setNumPlayers(bigData.numPlayers);
  };

  function login() {
    if (formState.value == 'carp') {
      setHost(true);
    }
  }

  function handlePWChange(event) {
    setFormState({value: event.target.value});
  }

  function handleWordChange(event) {
    setAllWords(event.target.value)
  }

  function sendWords(event) {
    bankChannel.trigger('client-bank-event', {words: allWords});
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p >Welcome!</p>
        {!isHost && 
          <div>
            <input placeholder='Password' type="password" value={formState.value} onChange={handlePWChange}></input>
            <button type="button" onClick={login}>Login</button>
          </div>
        }

        {isHost &&
          <div>
            <div>You are host</div>
            <div>
              <div>Enter words for game</div>
              <textarea placeholder='Example: parent, child, sibling, father, mother' value={allWords} maxlength="50" onChange={handleWordChange}></textarea>
              <div>character count: {allWords.length}</div>
              <button onClick={sendWords}>Send</button>
            </div>
          </div>
        }

        {!isGameStarted && <div>Waiting players: {numPlayers}</div>}
        {isGameStarted && <div>Playing: {numPlayers}</div>}

        {!isReady && !isGameStarted && <button type="button" onClick={setReadyStatus}>Click to play</button>}
        {isReady && !isGameStarted && <div>Waiting...</div>}
        
        <div>Your word is: {selectedEvenWord} or {selectedOddWord}</div>
        {!isGameStarted && <UserComponent bigData={bigData}></UserComponent>}
        
      </header>
    </div>
  );
}

export default App;
