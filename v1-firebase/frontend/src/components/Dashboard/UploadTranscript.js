// src/components/Dashboard/UploadTranscript.js

import React, { useState } from 'react';
import { auth } from '../../firebase';
import { Button, Input } from '@mui/material';

const UploadTranscript = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const token = await auth.currentUser.getIdToken();

      const formData = new FormData();
      formData.append('transcript', file);

      fetch('https://us-central1-msaas-feedback.cloudfunctions.net/api/uploadTranscript', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then(() => {
          alert('Transcript uploaded and processed successfully');
        })
        .catch((error) => {
          console.error('Error uploading transcript:', error);
          alert('Failed to upload transcript');
        });
    } catch (error) {
      console.error('Error obtaining auth token:', error);
      alert('Authentication error');
    }
  };

  return (
    <div>
      <h2>Upload Transcript</h2>
      <Input
        type="file"
        inputProps={{ accept: '.txt,.md' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        style={{ marginLeft: '16px' }}
      >
        Upload and Process
      </Button>
    </div>
  );
};

export default UploadTranscript;
