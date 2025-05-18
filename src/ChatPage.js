import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPage.css";
import { WebSocketActions } from './Constants';

const WebSocketUrl = process.env.REACT_APP_WEBSOCKET_URL;

const ChatPage = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);
  
  useEffect(() => {
    const socket = new WebSocket(WebSocketUrl); 
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      const messageToSend = {'type': WebSocketActions.GET_CHAT};
      socket.send(JSON.stringify(messageToSend));

    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === WebSocketActions.NEW_MESSAGE){
        const newMessage = data.message;
        setMessages((prevMessages) => [...prevMessages, 
            { name: data.user,message: newMessage,time: Date.now() }]);
      }
      else if(data.type === WebSocketActions.OLD_MESSAGES) {
        setMessages(data.chat);
      }

    };

    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };
    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageToSend = {'body':{ 'name': username,'message': message },'type': WebSocketActions.SEND};
      ws.send(JSON.stringify(messageToSend));
      
      setMessages((prevMessages) => [...prevMessages, {name: username, message, time: Date.now() }]);

      setMessage('');
    } else {
      console.error('WebSocket is not open');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      sendMessage();
    }
  };

  const logOut = () => {
    navigate('/login');
  }

  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (!name) {
      navigate('/login'); 
    } else {
      setUsername(name);
    }
  }, [navigate]);

  return (
    <div style={{ padding: 20,background: 'linear-gradient(135deg, #e0f2ff, #e5d4ff)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome to chat room {username}</h2>
        <button onClick={logOut} className="logout-button" style={{ padding: '10px' }}>LogOut</button>
    </div>
    <div style={{ marginBottom: 20, height: '580px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
      {}
      {messages.sort((a, b) => a.time - b.time).map((msg, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: msg.name !== username ? 'flex-start' : 'flex-end',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              backgroundColor: msg.name === username ? '#DCF8C6' : '#FFFFFF',
              padding: '10px',
              borderRadius: '10px',
              maxWidth: '60%',
              wordBreak: 'break-word',
              border: '1px solid #000000'
            }}
          >
            <strong>{msg.name === username ?'You' : msg.name}: </strong>{msg.message}
            <div style={{ alignSelf: 'flex-end', fontSize: '0.75em', color: '#666', marginTop: '5px' }}>
            {new Date(msg.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} {}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <div style={{ display: 'flex', gap: '10px' }}>
      {}
      <input
        type="text"
        value={message}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ flex: 1, padding: '10px' }}
      />
      <button disabled={!message.trim()} onClick={sendMessage} className="send-button" style={{ padding: '10px' }}>Send</button>
    </div>
  </div>
  );
};

export default ChatPage;
