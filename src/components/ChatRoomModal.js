import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ChatRoomModal = ({ show, handleClose, schools, socket }) => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedSchool) {
      socket.emit('joinRoom', selectedSchool);
    }

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedSchool, socket]);

  const handleSendMessage = () => {
    socket.emit('sendMessage', { schoolName: selectedSchool, message, username: 'Anonymous' }); // You can use user's real name or username
    setMessage('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Join a Chat Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!selectedSchool ? (
          <Form.Group controlId="schoolSelect">
            <Form.Label>Select a School to Join</Form.Label>
            <Form.Control as="select" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
              <option value="">Choose...</option>
              {schools.map((school) => (
                <option key={school._id} value={school.name}>
                  {school.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        ) : (
          <>
            <h5>Chat Room: {selectedSchool}</h5>
            <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
              {messages.map((msg, index) => (
                <p key={index}><strong>{msg.username}</strong>: {msg.message}</p>
              ))}
            </div>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSendMessage} disabled={!message}>
              Send
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ChatRoomModal;