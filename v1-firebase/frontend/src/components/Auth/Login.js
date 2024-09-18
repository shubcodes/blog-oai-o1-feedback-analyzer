// src/components/Auth/Login.js
import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Container, TextField, Button, Typography } from '@mui/material';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();

    try {
      setError('');
      await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Log In</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField label="Email" type="email" inputRef={emailRef} fullWidth required margin="normal" />
        <TextField label="Password" type="password" inputRef={passwordRef} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
          Log In
        </Button>
      </form>
      <Typography variant="body2" style={{ marginTop: '16px' }}>
        Need an account? <Link to="/signup">Sign Up</Link>
      </Typography>
    </Container>
  );
};

export default Login;
