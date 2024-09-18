# Intelligent Customer Feedback Analyzer - 24 Hour Challenge

This repository contains the codebase developed during the **24-hour challenge** to build an MVP for an **Intelligent Customer Feedback Analyzer**. The idea was to create a SaaS tool that could analyze customer feedback, including pain points, feature requests, and product insights, by ingesting Zoom transcripts and integrating with tools like Sybill, OpenAI, Fireworks AI, and other meeting bots. This tool targets sales, business, support, and product teams, particularly for startups. 

The project was originally built using **Firebase** and **OpenAI** but encountered several technical difficulties. We then pivoted to a **Python** implementation using **FastAPI** and **Fireworks AI**.

For a full breakdown of the challenges, approach, and technical details, please refer to the [blog post](https://shub.codes/739a210482d3).

---

## Project Structure

The repo is divided into two main versions reflecting the different approaches taken during the challenge:

### 1. `v1-firebase/` 
This folder contains the **initial implementation using Firebase** for hosting, authentication, and functions. The project attempted to integrate **OpenAI** for transcript analysis and chatbot functionality.

- **Tech Stack**: React (frontend), Firebase (backend), Firebase Functions (API), OpenAI API
- **Known Issues**:
  - Internal server errors related to **Firebase Functions**.
  - **CORS errors** and authentication issues with the OpenAI API.
  - Struggled with **npm dependency conflicts**.
  
For more detailed analysis and the technical challenges faced, read the "Firebase Approach" section in the [blog post](https://shub.codes/739a210482d3).

### 2. `v2-python/`
This folder contains the **refined version using Python (FastAPI)** as the backend framework, along with **Fireworks AI** for handling the customer feedback analysis and chatbot functionality.

- **Tech Stack**: Python, FastAPI (backend), Fireworks AI (for transcript processing and chatbot)
- **Improvements**:
  - Streamlined API integration using **FastAPI**.
  - Resolved many issues related to **CORS** and server deployment.
  - Much more stable and easier to manage without the complex setup required by Firebase.

For detailed explanations about the switch to Python and Fireworks AI, see the "Python Approach" and "The Pivot" sections in the [blog post](https://shub.codes/739a210482d3).

---

## Features

### v1 (Firebase):
- React-based frontend.
- Firebase Authentication.
- OpenAI integration for chat and transcript analysis.
- Firebase Functions for backend logic.

### v2 (Python):
- FastAPI-based backend.
- Fireworks AI for transcript analysis and chat functionality.
- Simplified setup with easier API integration and error handling.

---

## Setup Instructions

### v1 (Firebase):
1. Navigate to the `v1-firebase/` folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Deploy Firebase functions:
   ```
   firebase deploy --only functions
   ```
4. To serve the frontend:
   ```
   npm start
   ```

### v2 (Python):
1. Navigate to the `v2-python/` folder.
2. Create a virtual environment and activate it:
   ```
   python3 -m venv env
   source env/bin/activate
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

---

## Future Enhancements

1. Integrating more **AI models** and expanding functionality to allow deeper analytics.
2. Improving real-time error handling for both **backend** and **API integrations**.
3. Exploring full **CI/CD** pipeline integration to reduce deployment errors.
4. Extending support for additional feedback platforms like **Notion** and **Salesforce**.

---

For more details, see the [blog post](https://shub.codes/739a210482d3).