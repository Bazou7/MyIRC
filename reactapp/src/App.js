import io from "socket.io-client";
import React, { useState } from 'react';
import Chat from "./Chat"
import "./App.css";

const socket = io.connect("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState("");



  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setArrivalMessage(username, "est arrivé dans le chat");
      setShowChat(true);
    }
  }

  const EnterKey = (event) => {
    if (event.key === "Enter") {
      joinRoom();
    }
  }

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Rejoindre un chat</h3>
          <div className="inputContainer">
            <input type="text" placeholder="Entrer votre nom" onChange={(event) => { setUsername(event.target.value) }} onKeyDown={EnterKey}></input>
            <input type="text" placeholder="Entrer le nom channel" onChange={(event) => { setRoom(event.target.value) }} onKeyDown={EnterKey}></input>
          </div>
          <button onClick={joinRoom}>Rejoindre</button>
        </div>
      )
        : (
          <Chat socket={socket} username={username} room={room} arrivalMessage={arrivalMessage} />
        )}
    </div>
  );
}

export default App;
