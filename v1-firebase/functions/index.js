// functions/index.js

const functions = require('firebase-functions'); // 1st Gen import
const admin = require('firebase-admin');
const axios = require('axios'); // Import axios
const express = require('express');
const cors = require('cors');
const Busboy = require('busboy'); // Ensure Busboy version 0.3.1 is installed

admin.initializeApp();
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Authentication middleware
app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No auth token provided');
      return res.status(401).send('Unauthorized: No auth token provided');
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).send('Unauthorized');
  }
});

// Chat Endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).send({ error: 'Message is required.' });
    }

    // Log to verify API Key access
    console.log('Fireworks API Key:', functions.config().fireworks.key ? 'Available' : 'Not Set');

    // Prepare the request payload
    const payload = {
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct", // Ensure this model exists in Fireworks AI
      messages: [{ role: "user", content: message }],
    };

    // Make the API call to Fireworks AI
    const response = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${functions.config().fireworks.key}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract the reply from the response
    const reply = response.data.choices[0].message.content.trim();

    res.send({ reply });
  } catch (error) {
    console.error('Error processing chat:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Failed to process chat message.' });
  }
});

// Upload Transcript Endpoint
app.post('/uploadTranscript', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  let transcriptContent = '';

  busboy.on('file', (fieldname, file) => {
    file.on('data', (data) => {
      transcriptContent += data.toString();
    });
  });

  busboy.on('finish', async () => {
    try {
      // Log to verify API Key access
      console.log('Fireworks API Key:', functions.config().fireworks.key ? 'Available' : 'Not Set');

      // Prepare the request payload
      const payload = {
        model: "accounts/fireworks/models/llama-v3p1-8b-instruct", // Adjust as needed
        messages: [{
          role: "user",
          content: `Analyze the following customer meeting transcript and provide a summary, list of pain points, and feature requests mentioned. Output the results in JSON format.\n\nTranscript:\n${transcriptContent}`
        }],
      };

      // Make the API call to Fireworks AI
      const response = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', payload, {
        headers: {
          'Authorization': `Bearer ${functions.config().fireworks.key}`,
          'Content-Type': 'application/json',
        },
      });

      // Extract and parse the response
      const responseData = response.data.choices[0].message.content.trim();
      let processedData;
      try {
        processedData = JSON.parse(responseData);
      } catch (e) {
        // Attempt to extract JSON from the response
        const jsonStart = responseData.indexOf('{');
        const jsonEnd = responseData.lastIndexOf('}') + 1;
        const jsonString = responseData.substring(jsonStart, jsonEnd);
        processedData = JSON.parse(jsonString);
      }

      // Store data in Firestore
      const db = admin.firestore();
      await db
        .collection('users')
        .doc(req.user.uid)
        .collection('transcripts')
        .add({
          uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
          data: processedData,
        });

      res.send({ success: true });
    } catch (error) {
      console.error('Error processing transcript:', error.response ? error.response.data : error.message);
      res.status(500).send({ error: 'Failed to process transcript.' });
    }
  });

  busboy.on('error', (error) => {
    console.error('Busboy error:', error);
    res.status(500).send({ error: 'Failed to process file upload.' });
  });

  req.pipe(busboy);
});

exports.api = functions.https.onRequest(app);
