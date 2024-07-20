import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const socket = io(BASE_URL, {
  path: ENDPOINT
});

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    socket.on('chat message', (username, msg) => {
      console.log(socket);
      setMessages((prevMessages) => [...prevMessages, {username, msg}]);
    });

    socket.on('username', (username) => {
      setUsername(username);
    })

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('chat message', message);
    setMessage('');
  };

  return (
    <main className="h-100 flex flex-column">
      <header className="flex items-center ph3 pv2 bb b--white">
        <h1 className="ma0 dib f1 mr3">Awesome Chat</h1>
        <h2 className="ma0 dib f1 blue">{username}</h2>
      </header>
      <div className="overflow-y-scroll h-100 ph3 pv2 ">
        {messages.map((msg, index) => (
          
          <div key={index}><strong className={msg.username === username ? `blue` : `red`}>{`${msg.username}`}</strong>: {`${msg.msg}`}</div>
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission
          if (message.trim()) {
            sendMessage();
          }
        }}
      >
      <div className="ph3 pv2 flex">
        <input
          className="w-100"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && message.trim()) {
              e.preventDefault(); // Prevent form submission on Enter
              sendMessage();
            }
          }}
          required
          aria-required="true" // Enhances accessibility
          title="Please input text"
        />
        <button className="ml2" type="submit">Send</button>
      </div>
      </form>
    </main>
  );
};

export default Chat;

