// src/components/Dashboard/TranscriptList.js

import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const TranscriptList = () => {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    const fetchTranscripts = async () => {
      const userId = auth.currentUser.uid;
      const q = query(
        collection(db, 'users', userId, 'transcripts'),
        where('uploadedAt', '!=', null)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setTranscripts(data);
    };

    fetchTranscripts();
  }, []);

  return (
    <div>
      <h2>Your Transcripts</h2>
      {transcripts.length === 0 ? (
        <Typography>No transcripts found.</Typography>
      ) : (
        <List>
          {transcripts.map((transcript, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Transcript ${index + 1}`}
                secondary={JSON.stringify(transcript.data)}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default TranscriptList;
