import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

function App() {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
 const [currentRoom, setCurrentRoom] = useState('');
  const [joinRoomInput, setJoinRoomInput] = useState('');
  // console.log("all message",messages);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socket.on('room_joined_confirmation', (roomName) => {
      console.log(`Successfully joined room: ${roomName}`);
    });

    return () => {
      socket.off('receive_message');
      socket.off('room_joined_confirmation');

    };
  }, [socket]);


    const joinRoom = () => {
    if (joinRoomInput) {
      setMessages([]);
      socket.emit('join_room', joinRoomInput);
      setCurrentRoom(joinRoomInput);
      setJoinRoomInput('');
    }
  };

  const sendMessage = () => {
    if (message && currentRoom) {
      socket.emit('send_room_message', { room: currentRoom, message });
      setMessage('');
    }
  };

return (
    <div style={{ padding: '20px' }}>
      <h1>React Socket.IO Chat Rooms</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={joinRoomInput}
          onChange={(e) => setJoinRoomInput(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      {currentRoom && (
        <>
          <h2>You are in room: {currentRoom}</h2>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send to Room</button>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <p key={index}>
            **Room ({msg.room})**: {msg.text}
          </p>
        ))}
      </div>
        </>
      )}

      
    </div>
  );
}
export default App;
