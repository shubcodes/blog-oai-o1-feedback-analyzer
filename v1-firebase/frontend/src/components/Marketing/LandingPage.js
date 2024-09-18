// src/components/Marketing/LandingPage.js
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useHistory if using React Router DOM v5
// import { useNavigate } from 'react-router-dom'; // Uncomment this line if using React Router DOM v6
import Header from '../Layout/Header';

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize history for navigation
  // const navigate = useNavigate(); // Use this instead of useHistory if using React Router DOM v6

  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h2" gutterBottom>
          Unlock Customer Insights Instantly
        </Typography>
        <Typography variant="h5" gutterBottom>
          Transform your customer interactions into actionable insights.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/signup')} // Use navigate('/signup') if using useNavigate
          style={{ marginTop: '20px' }}
        >
          Get Started
        </Button>
      </Container>
    </>
  );
};

export default LandingPage;
