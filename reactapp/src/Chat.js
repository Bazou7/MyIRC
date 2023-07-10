import React, { useMemo, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";


function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [currentUser, setCurrentUser] = useState(username);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            if (currentMessage.startsWith("/nick ")) {
                const newUsername = currentMessage.split("/nick ")[1];
                setCurrentUser(newUsername);
                setCurrentMessage("");
            }

            else {
                const messageData = {
                    room: room,
                    author: currentUser,
                    message: currentMessage,
                    time: new Date(Date.now()).getHours() + "h" + new Date(Date.now()).getMinutes() + "min",
                };

                await socket.emit("send_message", messageData);
                setMessageList((list) => [...list, messageData]);
                setCurrentMessage("");
            }
        }
    };


    useMemo(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
            console.log(data);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);


    return (
        <div>
            <div className="chat-window">
                <div className="chat-header">
                    <p>{room}</p>
                </div>
                <div className="chat-body">
                    <ScrollToBottom className="message-container">
                        {messageList.map((messageContent) => {
                            return (
                                <div className="message" id={username === messageContent.author ? "you" : "other"}>
                                    <div>
                                        <div className="message-content">
                                            <p>{messageContent.message}</p>
                                            <div className="message-meta" />
                                        </div>
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </ScrollToBottom>
                </div>
                <div className="chat-footer">
                    <input type="text" placeholder="Entrer votre message" onChange={(event) => { setCurrentMessage(event.target.value) }}
                        onKeyDown={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    ></input>
                    <button onClick={sendMessage}>Envoyer</button>
                </div>
            </div>
        </div>
    )
}

export default Chat