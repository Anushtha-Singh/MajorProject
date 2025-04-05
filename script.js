const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Load chat history when the page loads
window.onload = () => {
    const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    savedMessages.forEach(msg => addMessage(msg.content, msg.role));
};

function generateSessionId() {
    return crypto.randomUUID(); // Generates a unique ID
}

async function sendMessage() {
    if (!userInput.value.trim()) return;

    const userText = userInput.value;
    userInput.value = "";

    // Show user message
    addMessage(userText, "user");
    
    // Show bot typing indicator
    const botTyping = addMessage("Typing...", "bot");

    try {
        const response = await fetch("https://govtschemes.app.n8n.cloud/webhook/chatbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId: generateSessionId(), 
                query: userText }),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        botTyping.remove();
        addMessage(data.response || "I couldn't find relevant information.", "bot");

    } catch (error) {
        console.error("Error fetching response:", error);
        botTyping.remove();
        addMessage("Sorry, something went wrong. Please try again.", "bot");
    }

    saveChatHistory(); // Save after new messages
}

// Function to display messages
function addMessage(content, role) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", role);
    msg.textContent = content;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatHistory(); // Save after each message
    return msg;
}

// Save chat history
function saveChatHistory() {
    const messages = [...document.querySelectorAll(".chat-message")].map(msg => ({
        content: msg.textContent,
        role: msg.classList.contains("user") ? "user" : "bot"
    }));
    localStorage.setItem("chatHistory", JSON.stringify(messages));
}

// Clear chat history
function clearChat() {
    localStorage.removeItem("chatHistory");
    chatBox.innerHTML = "";
}
