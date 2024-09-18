// src/components/Chatbot/Chatbot.js

import React, { useState } from 'react';
import { auth } from '../../firebase';
import { TextField, Button, Typography } from '@mui/material';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const handleSend = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      fetch('https://us-central1-msaas-feedback.cloudfunctions.net/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      })
        .then((response) => response.json())
        .then((data) => {
          setReply(data.reply);
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          alert('Failed to get a reply');
        });
    } catch (error) {
      console.error('Error obtaining auth token:', error);
      alert('Authentication error');
    }
  };

  return (
    <div>
      <h2>Chatbot</h2>
      <TextField
        label="Ask a question"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        style={{ marginTop: '16px' }}
      >
        Send
      </Button>
      {reply && (
        <Typography variant="body1" style={{ marginTop: '16px' }}>
          <strong>Reply:</strong> {reply}
        </Typography>
      )}
    </div>
  );
};

export default Chatbot;
