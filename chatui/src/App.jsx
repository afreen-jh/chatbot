import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

// Initialize your API client using Vite environment variables safely
const ai = new GoogleGenerativeAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [workspaces, setWorkspaces] = useState([
    { id: '1', name: 'New Chat 7', messages: [] },
    { id: '2', name: 'What is an ai?', messages: [] },
    { id: '3', name: 'What is mern?', messages: [] },
    { id: '4', name: 'What is software dev...', messages: [] },
    { id: '5', name: 'React Help', messages: [] },
    { id: '6', name: 'JavaScript Project', messages: [] },
    { id: '7', name: 'HTML UI Design', messages: [] }
  ]);

  const [activeChatId, setActiveChatId] = useState('2');

  const activeChat = workspaces.find((w) => w.id === activeChatId) || workspaces[0];

  const handleSendMessage = async (inputText, selectedImage) => {
    if (!inputText.trim() && !selectedImage) return;

    // 1. Create the user message object
    const userMessage = {
      text: inputText,
      image: selectedImage,
      isBot: false,
    };

    // Update state to show user message instantly
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === activeChatId ? { ...w, messages: [...w.messages, userMessage] } : w
      )
    );

    try {
      // 2. Dynamically build the API payload contents array
      let contentsParts = [];

      // Always add the text part if it exists
      if (inputText.trim()) {
        contentsParts.push({ text: inputText });
      }

      // ONLY parse and add the image if one was actually uploaded by the user
      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];

        contentsParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }

      // 3. Request completion from Gemini using the structured layout array
      const result = await model.generateContent({
        contents: [{ parts: contentsParts }],
      });

      const responseText = await result.response.text();

      // 4. Create the bot response object
      const botMessage = {
        text: responseText,
        image: null,
        isBot: true,
      };

      // Add bot message response to the workspace chat timeline
      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === activeChatId ? { ...w, messages: [...w.messages, botMessage] } : w
        )
      );
    } catch (error) {
      console.error("Gemini API Error Details:", error);
      
      const errorMessage = {
        text: "❌ Failed to generate response. Please check your network or image format.",
        image: null,
        isBot: true,
      };

      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === activeChatId ? { ...w, messages: [...w.messages, errorMessage] } : w
        )
      );
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        workspaces={workspaces}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setWorkspaces={setWorkspaces}
      />
      <ChatWindow
        activeChat={activeChat.name}
        messages={activeChat.messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;