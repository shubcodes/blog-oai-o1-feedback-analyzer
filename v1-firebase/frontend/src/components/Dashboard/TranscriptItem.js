// src/components/Dashboard/TranscriptItem.js
import React from 'react';


const TranscriptItem = ({ transcript }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Uploaded at: {transcript.uploadedAt?.toDate().toLocaleString()}</h3>
      <pre>{JSON.stringify(transcript.data, null, 2)}</pre>
    </div>
  );
};


export default TranscriptItem;
