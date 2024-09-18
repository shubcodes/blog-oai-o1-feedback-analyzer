// src/components/Dashboard/Dashboard.js

import React from 'react';
import UploadTranscript from './UploadTranscript';
import TranscriptList from './TranscriptList';
import Chatbot from '../Chatbot/Chatbot';
import { Button } from '@mui/material';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button
        variant="outlined"
        onClick={handleLogout}
        style={{ float: 'right', margin: '16px' }}
      >
        Logout
      </Button>
      <h1>Dashboard</h1>
      <UploadTranscript />
      <TranscriptList />
      <Chatbot />
    </div>
  );
};

export default Dashboard;
