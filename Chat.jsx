import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat()
{
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
    {
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);

      if (user && user.username)
      {
        const newSocket = io(
          "http://localhost:3001",
          {
            query:
            {
              username: user.username
            }
          }
        );

        setSocket(newSocket);

        return () =>
        {
          newSocket.disconnect();
        };
      }
    },
    []
  );

  useEffect(
    () =>
    {
      if (!socket)
      {
        return;
      }

      socket.on(
        "oldMessages",
        (msgs) =>
        {
          setMessages(msgs);
        }
      );

      socket.on(
        "userNotification",
        (data) =>
        {
          setMessages(
            (prev) =>
            [
              ...prev,
              { system: true, message: data.message }
            ]
          );
        }
      );

      socket.on(
        "receiveMessage",
        (data) =>
        {
          setMessages(
            (prev) =>
            [
              ...prev,
              data
            ]
          );
        }
      );

      return () =>
      {
        socket.off("oldMessages");
        socket.off("userNotification");
        socket.off("receiveMessage");
      };
    },
    [socket]
  );

  function sendMessage()
  {
    if (message.trim() && socket)
    {
      socket.emit(
        "sendMessage",
        {
          user: currentUser.username,
          text: message
        }
      );

      setMessage("");
    }
  }

  if (!currentUser)
  {
    return <h2>Loading chat...</h2>;
  }

  return (
    <div className="app">
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="messages">
        {
          messages.map(
            (msg, index) =>
            {
              if (msg.system)
              {
                return (
                  <div
                    key={index}
                    className="system-message"
                  >
                    {msg.message}
                  </div>
                );
              }

              let messageClass = "message other";

              if (msg.user === currentUser.username)
              {
                messageClass = "message own";
              }

              return (
                <div
                  key={index}
                  className={messageClass}
                >
                  <span className="username">
                    {msg.user}
                  </span>
                  <p>{msg.text}</p>
                </div>
              );
            }
          )
        }
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </div>
  );
}

export default Chat;
