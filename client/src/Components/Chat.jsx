import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = () => {

    // State variables
    const [approve, setApprove] = useState(false);
    const [username, setUsername] = useState("");
    const [input, setInput] = useState("");
    // Store messages sent into empty array
    const [messages, setMessages] = useState([]);
    const [socket] = useState(() => io(':8000'));


    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [currentUserID, setCurrentUserID] = useState(null);


    useEffect(() => {
        // Set up all of our even listeners in the useEffect callback function
        console.log("Is this running?");
        // Socket listener 


        // Setting message to state
        socket.on('post chat', (msg) => { setMessages(prevMsgState => [...prevMsgState, msg]) });

        // Running callback function to ensure that the underlying socket will be closed if App is unmounted.
        // This would be more critical if we were creating the scoket in a subcomponent.
        return () => socket.removeAllListeners;
        // dependency array
    }, [socket]);


    useEffect(() => {
        if (userIsLoggedIn) {
            socket.emit('user_logged_in', { userId: currentUserID });
        }
    }, [userIsLoggedIn]);




    const usernameHandler = (e) => {
        e.preventDefault()
        // console.log("This is our usernameHandler.")
        if (username) {
            setApprove(true);
        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault()
        socket.emit("chat", { username: username, content: input })
        setInput("");

    }

    const renderChat = () => {
        return messages.map((msg, i) => (<p key={i} >{msg.username}: {msg.content}</p>))
    }




    return (
        <div>
            <h1>In Round Chat</h1>
            {
                !approve ?
                    <div className="container" style={{ marginRight: "100px", marginBottom: "500px" }} >
                        <div className="card" >
                            <div className="name-field" >
                                <form onSubmit={usernameHandler} >
                                    <input type="text" className="form-inline" onChange={e => setUsername(e.target.value)} placeholder="Enter your name" value={username} />
                                    <br />
                                    <button className="btn btn-outline-dark mt-3" >Enter Chat</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    :


                    <div className="card" >
                        <form onSubmit={onSubmitHandler} >
                            <input type="text" className="form-inline" name="msg" onChange={e => setInput(e.target.value)} placeholder="Enter a message" value={input} />
                            <br />
                            <button className="btn btn-outline-dark mt-3" >Send Message</button>
                        </form>
                        <div className="chat-Container" >
                            <hr />
                            <h1>Messages</h1>
                            {renderChat()}
                        </div>
                    </div>


            }
        </div>
    )
}

export default Chat