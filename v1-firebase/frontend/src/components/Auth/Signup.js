// src/components/Auth/Signup.js
import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Container, TextField, Button, Typography } from '@mui/material';

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignup = async e => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Sign Up</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSignup}>
        <TextField label="Email" type="email" inputRef={emailRef} fullWidth required margin="normal" />
        <TextField label="Password" type="password" inputRef={passwordRef} fullWidth required margin="normal" />
        <TextField label="Confirm Password" type="password" inputRef={passwordConfirmRef} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" style={{ marginTop: '16px' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </Typography>
    </Container>
  );
};

export default Signup;
