import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:3000');
const socket = io('http://www.adrucker.com:3000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (username, msg) => {
      msg = `${username}: ${msg}`;
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

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
      <h1 className="ma0 ph3 pv2 bb b--white">Awesome Chat</h1>
      <div className="overflow-y-scroll h-100 ph3 pv2">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
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

