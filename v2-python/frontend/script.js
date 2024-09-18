// frontend/script.js

const API_BASE_URL = "http://localhost:8000"; // Adjust if backend is hosted elsewhere

document.getElementById("send-chat-btn").addEventListener("click", sendMessage);
document.getElementById("upload-transcript-btn").addEventListener("click", uploadTranscript);

function appendMessage(content, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");
    messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
    messageDiv.innerText = content;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (!message) return;

    appendMessage(message, "user");
    input.value = "";

    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer YOUR_ID_TOKEN" // Add authentication later
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            appendMessage(`Error: ${errorData.detail || "Failed to send message."}`, "ai");
            return;
        }

        const data = await response.json();
        appendMessage(data.reply, "ai");
    } catch (error) {
        appendMessage(`Error: ${error.message}`, "ai");
    }
}

async function uploadTranscript() {
    const fileInput = document.getElementById("transcript-file");
    const file = fileInput.files[0];
    const statusDiv = document.getElementById("upload-status");

    if (!file) {
        statusDiv.innerText = "Please select a file to upload.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    statusDiv.innerText = "Uploading...";

    try {
        const response = await fetch(`${API_BASE_URL}/uploadTranscript`, {
            method: "POST",
            // "Authorization": "Bearer YOUR_ID_TOKEN", // Add authentication later
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            statusDiv.innerText = `Error: ${errorData.detail || "Failed to upload transcript."}`;
            return;
        }

        const data = await response.json();
        statusDiv.innerText = "Transcript uploaded and processed successfully!";
        console.log("Processed Data:", data.data);
    } catch (error) {
        statusDiv.innerText = `Error: ${error.message}`;
    }
}
